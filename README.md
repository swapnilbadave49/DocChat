# DocChat

### Document Reading, Redefined.

PageTalk allows you to effortlessly converse with your documents. Simply upload a document, and PageTalk will automatically generate a summary of the document. You can then ask questions about the document, and PageTalk will provide you with the answers. PageTalk is perfect for students, researchers, and professionals who want to quickly understand and analyze documents.

Export the document to [NoteSync](https://github.com/techymt/NoteSync), and you can easily share the document with your friends and colleagues. NoteSync allows you to collaborate with others in real-time, making it easy to work together on projects.

<div align="center">
    <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOG1jcnB3Y2Ezdjlhd2podHVrZ2hneG9lY292c2VnZHZpdXR2bGpkZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3orifaQEOagjYJ1EXe/giphy.gif" height="250px">
</div>

# Demo

[Demo.webm](https://github.com/shxntanu/PageTalk/assets/97496261/cbb7bdd1-15d2-41e4-bc76-455a77f436ca)

## Built With

-   Frontend: **NextJS**
-   Database, Cloud Storage, and Authentication: **Supabase**
-   Backend: **Flask**
-   LLM: **Mixtral 8x7b**

# Getting Started

1. Set-up a supabase project and get the Public URL and ANON Key.
2. Clone the repository.
3. Create a `.env.local` file in the root directory and add the following environment variables:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
    ```
4. Create tables in your Supabase database according to the schema in [`client/src/supabase/database.types.ts`](client/src/supabase/database.types.ts).
5. Set up Row Level Policies for each table to allow SELECT, INSERT, DELETE and UPDATE for authenticated users only.
6. Set up authentication in Supabase and enable email verification.
7. Run the following commands:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    That will get your frontend running.
8. For the backend, run the following commands:
    ```bash
    cd backend
    
    python3 -m venv env
    source env/bin/activate

    pip install -r requirements.txt

    python3 server.py
    ```
    That will get your backend running.
9. You will need to add environment variables as specified in [`server/.env.example`](server/.env.example) to a `.env` file in the `server` directory.
10. And that's it! You're all set up.

# Features

-   **Document Summarization**: PageTalk automatically generates a summary of the document.
-   **Question Answering**: Ask questions about the document, and PageTalk will provide you with the answers.
-   **Export to NoteSync**: Export the document to as a Note in proper markdown format to [NoteSync](https://github.com/techymt/NoteSync)


## Contributors

-   [Sahil Katkamwar](https://github.com/jaalnock)
