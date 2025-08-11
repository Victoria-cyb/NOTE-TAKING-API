# NOTE-TAKING-API

A GraphQL-based Note-Taking API with user authentication, note sharing, and daily email reminders.

## Setup

1. **Clone the repository**
   git clone https://github.com/Victoria-cyb/NOTE-TAKING-API.git
   cd NOTE-TAKING-API



# GraphQL Queries and Mutations

# Register: 
mutation { register(email: "user@example.com", password: "password", firstName: "User" lastName: "name") { token, user { id, email, firstName, lastName
} } }

# Login: 
mutation { login(email: "user@example.com", password: "password") { token, user { id, email, firstName, lastName } } }

# Create Note: 
mutation { createNote(title: "My Note", content: "Content") { id, title, content,  createdAt,
    updatedAt 
    owner {
      email
      }
     }

    }

    User Token should be passed at the header Using Authorization Bearer ""

# Share Note: 
mutation { shareNote(id: "note_id", email: "sharee@example.com") { id, status { id title } sender{
  id, email
}
receiver {
  id, email
} } }

 User Token(Sharer token from login) should be passed at the header Using Authorization Bearer ""

 Emails are sented to receivers to accept or decline request


# Get Notes, note: 
query { notes { id, title, content, owner { email }, sharedWith { email } } }

query {
  note(id: "note-id") {
    id
    title
    content
    owner {
      email
    }
  }
}


User Token(Sharer token from login) should be passed at the header Using Authorization Bearer ""

# Update Notes:
mutation {
  updateNote(id:"note-id", title:"Updated Note", content:"This is the updated content" ) {
    id
    title
    content
    createdAt
    updatedAt
    owner {
      email
    }
    updatedAt
  }
}

User Token should be passed at the header Using Authorization Bearer ""


# Delete Notes
mutation {
  deleteNote(id: "note-id") 
}

User Token should be passed at the header Using Authorization Bearer ""


# Pending sharingrequest
query {
  pendingShareRequests {
    id
    status
    note {
      title
    }
    sender {
      email
    }
  }
}


User Token should be passed at the header Using Authorization Bearer ""


# Response to share request
mutation {
  respondToShareRequest(requestId: "", accept: true or false) {
    id
    status
    note {
      title
    }
    receiver {
      email
    }
  }
}

User Token should be passed at the header Using Authorization Bearer ""


Emails are sent to sender to tell if request was guarented or declined and the receiver and view the note using the note query by passing note id. 



# How to run the server
Use npm run dev


# How to test the cron job
it was scheduled for 8pm but if you need to run check it out 
After cloning, run the server and edit the util/cron.js file line 6 to run email reminder in 5 minutes to all registered users and get the emails in 5 minutes after editing code from  cron.schedule('0 20 * * *') to   cron.schedule('* * * * *')

