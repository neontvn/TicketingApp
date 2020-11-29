# TicketingApp

Auth Service

    Route               Method              Body                        Purpose
    
/api/users/signup        POST   {email: string, password: string}   Sign up for an account
/api/users/signin        POST   {email: string, password: string}   Sign in to an existing account
/api/users/signout       POST                {}                     Sign Out
/api/users/currentuser   GET                  -                     Return info about the user
