const Note = require('../models/Note');
const User = require('../models/User');
const ShareRequest = require('../models/ShareRequest');
const { sendShareResponseEmail, sendShareRequestEmail } = require('../utils/email')

module.exports = {
  Query: {
    notes: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return Note.find({ $or: [{ owner: user._id }, { sharedWith: user._id }] });
    },
    note: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return Note.findOne({ _id: id, $or: [{ owner: user._id }, { sharedWith: user._id }] });
    },

     pendingShareRequests: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return ShareRequest.find({ receiver: user._id, status: 'pending' })
        .populate('note')
        .populate('sender')
        .populate('receiver');
    }
  
  },
  Mutation: {
    createNote: async (_, { title, content }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const note = new Note({ title, content, owner: user._id, sharedWith: [] });
      return note.save();
    },
    updateNote: async (_, { id, title, content }, { user }) => {
      console.log('UpdateNote inputs:', { id, title, content, userId: user?._id });
      if (!user) throw new Error('Not authenticated');
     const note = await Note.findOneAndUpdate(
  { _id: id, owner: user._id },
  { title, content },
  {
    new: true,
    timestamps: true
  }
);

      if (!note) throw new Error('Note not found or not owned by user');
      return note;
    },
    deleteNote: async (_, { id }, { user }) => {
      console.log('DeleteNote inputs:', { id, userId: user?._id });
      if (!user) throw new Error('Not authenticated');
      const note = await Note.findOneAndDelete({ _id: id, owner: user._id });
      if (!note) throw new Error('Note not found or not owned by user');
      return !!note; 
;
    },
    shareNote: async (_, { id, email }, { user }) => {
      console.log('ShareNote inputs:', { id, email, userId: user?._id });
      if (!user) throw new Error('Not authenticated');

      const note = await Note.findOne({ _id: id, owner: user._id });
      if (!note) throw new Error('Note not found or not owned by user');

      const sharee = await User.findOne({ email });
      if (!sharee) throw new Error('User not found');

      if (sharee._id.equals(user._id)) throw new Error("You can't share a note with yourself");

     if (note.sharedWith.includes(sharee._id)) throw new Error('Note already shared with this user');

  const existingRequest = await ShareRequest.findOne({
    note: note._id,
    sender: user._id,
    receiver: sharee._id,
    status: 'pending'
  });
  if (existingRequest) throw new Error('Share request already sent');

  const request = new ShareRequest({
    note: note._id,
    sender: user._id,
    receiver: sharee._id
  });

  await request.save();

   // Send email to receiver
  try {
    await sendShareRequestEmail({ sender: user, receiver: sharee, note });
    console.log('📧 Share request email sent to receiver:', sharee.email);
  } catch (err) {
    console.error('❌ Failed to send share request email:', err);
  }
  return request;
},

  //  respondToShareRequest: async (_, { requestId, accept }, { user }) => {
  //     if (!user) throw new Error('Not authenticated');

  //     const request = await ShareRequest.findOne({ _id: requestId, receiver: user._id })
  //       .populate('note')
  //       .populate('sender')
  //       .populate('receiver');
  //     if (!request) throw new Error('Share request not found');
  //     if (!request.receiver._id.equals(user._id)) throw new Error('Not authorized to respond to this request');
  //     if (request.status !== 'pending') throw new Error('Request already handled');

  //     request.status = accept ? 'accepted' : 'declined';
  //     await request.save();

  //     if (accept) {
  //       const note = await Note.findById(request.note._id);
  //       if (!note.sharedWith.includes(user._id)) {
  //         note.sharedWith.push(user._id);
  //         await note.save();
  //       }
  //     }

  //     try {
  //       await sendShareResponseEmail ({
  //         sender: request.sender,
  //         receiver: request.receiver,
  //         note: request.note,
  //         accepted: accept
  //       })
  //     } catch (error) {
  //       console.error('Error sending share response email:', error);
  //     }

  //     return request;
  //   }
  

respondToShareRequest: async (_, { requestId, accept }, { user }) => {
  console.log('📨 Responding to share request:', { requestId, accept, currentUser: user?._id });

  // 1️⃣ Get the request and fully populate required fields
  const request = await ShareRequest.findOne({
    _id: requestId,
    receiver: user._id
  })
    .populate('note')
    .populate('sender')
    .populate('receiver');

  if (!request) {
    console.error('❌ Share request not found or not for this user');
    throw new Error('Share request not found');
  }

  console.log('✅ Found share request:', {
    requestId: request._id,
    sender: request.sender?.email,
    receiver: request.receiver?.email,
    note: request.note?.title
  });

  // 2️⃣ Update the request status
  request.status = accept ? 'accepted' : 'declined';
  await request.save();
  console.log(`📝 Request status updated to "${request.status}"`);

  // 3️⃣ If accepted, add note to receiver
  if (accept) {
    request.note.sharedWith.push(request.receiver._id);
    await request.note.save();
    console.log(`📄 Note "${request.note.title}" shared with ${request.receiver.email}`);
  }

  // 4️⃣ Send the email
  try {
    console.log('📧 Sending share response email...');
    await sendShareResponseEmail({
      sender: request.sender,
      receiver: request.receiver,
      note: request.note,
      accepted: accept
    });
    console.log('✅ Share response email sent successfully');
  } catch (error) {
    console.error('❌ Failed to send share response email:', error);
    throw new Error('Email sending failed');
  }

  return request;
},

  },
  Note: {
    owner: async (parent) => User.findById(parent.owner),
    sharedWith: async (parent) => User.find({ _id: { $in: parent.sharedWith } }),
    createdAt: (parent) => parent.createdAt.toISOString(),
    updatedAt: (parent) => parent.updatedAt.toISOString(),
  },

  ShareRequest: {
    note: async (parent) => Note.findById(parent.note),
    sender: async (parent) => User.findById(parent.sender),
    receiver: async (parent) => User.findById(parent.receiver),
  },
};