
// const Note = require('../models/Note');
// const User = require('../models/User');

// module.exports = {
//   Query: {
//     notes: async (_, __, { user }) => {
//       if (!user) throw new Error('Not authenticated');
//       return Note.find({ $or: [{ owner: user._id }, { sharedWith: user._id }] });
//     },
//     note: async (_, { id }, { user }) => {
//       if (!user) throw new Error('Not authenticated');
//       return Note.findOne({ _id: id, $or: [{ owner: user._id }, { sharedWith: user._id }] });
//     },
//   },
//   Mutation: {
//     createNote: async (_, { title, content }, { user }) => {
//       if (!user) throw new Error('Not authenticated');
//       const note = new Note({ title, content, owner: user._id, sharedWith: [] });
//       return note.save();
//     },
//     updateNote: async (_, { id, title, content }, { user }) => {
//         console.log('UpdateNote inputs:', { id, title, content, userId: user?._id });
//       if (!user) throw new Error('Not authenticated');
//       return Note.findOneAndUpdate(
//         { _id: id, owner: user._id },
//         { title, content, updatedAt: new Date() },
//         { new: true }
//       );
//     },
//     deleteNote: async (_, { id }, { user }) => {
//       if (!user) throw new Error('Not authenticated');
//       const note = await Note.findOneAndDelete({ _id: id, owner: user._id });
//       return !!note;
//     },
//     shareNote: async (_, { id, email }, { user }) => {
//       if (!user) throw new Error('Not authenticated');
//       const note = await Note.findOne({ _id: id, owner: user._id });
//       if (!note) throw new Error('Note not found or not owned by user');
//       const sharee = await User.findOne({ email });
//       if (!sharee) throw new Error('User not found');
//       if (!note.sharedWith.includes(sharee._id)) {
//         note.sharedWith.push(sharee._id);
//         await note.save();
//       }
//       return note;
//     },
//   },
//   Note: {
//     owner: async (parent) => User.findById(parent.owner),
//     sharedWith: async (parent) => User.find({ _id: { $in: parent.sharedWith } }),
//   },
// };




const Note = require('../models/Note');
const User = require('../models/User');

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
    timestamps: true // ✅ this makes Mongoose update `updatedAt`
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
      return !!note; // or: return true;
;
    },
    shareNote: async (_, { id, email }, { user }) => {
      console.log('ShareNote inputs:', { id, email, userId: user?._id });
      if (!user) throw new Error('Not authenticated');
      const note = await Note.findOne({ _id: id, owner: user._id });
      if (!note) throw new Error('Note not found or not owned by user');
      const sharee = await User.findOne({ email });
      if (!sharee) throw new Error('User not found');
      if (!note.sharedWith.includes(sharee._id)) {
        note.sharedWith.push(sharee._id);
        await note.save();
      }
      return note;
    },
  },
  Note: {
    owner: async (parent) => User.findById(parent.owner),
    sharedWith: async (parent) => User.find({ _id: { $in: parent.sharedWith } }),
    createdAt: (parent) => parent.createdAt.toISOString(),
    updatedAt: (parent) => parent.updatedAt.toISOString(),
  },
};