# PDF RAG

A small retrieval-augmented generation (RAG) example. It extracts text from a PDF, creates embeddings with OpenAI, stores them in Qdrant, and uses retrieved passages to answer a question with page references.

## Prerequisites

- Node.js 20.6 or newer (the commands below use Node's `--env-file` option)
- npm
- Docker with Docker Compose
- An OpenAI API key with access to the embedding and chat models used by the scripts

## Setup

From the project directory, initialize npm if this project does not already have a `package.json`, configure Node to use ES modules, and install the dependencies:

```sh
npm init -y
npm pkg set type=module
npm install @langchain/community @langchain/openai @langchain/qdrant openai
```

Create a `.env` file in the project root:

```dotenv
API_KEY=your_openai_api_key
```

Keep the real key private. The `.gitignore` excludes `.env` and `.env.*`; `.env.example` is allowed if you want to commit a placeholder template.

The indexing script reads `./the-time-machine.pdf`. That PDF is ignored by Git, so provide the file locally or update the path in `indexing.js` to point to your own PDF.

## Run

Start Qdrant:

```sh
docker compose up -d
```

Index the PDF:

```sh
node --env-file=.env indexing.js
```

After indexing completes, run a query:

```sh
node --env-file=.env query.js
```

The example question is currently hard-coded in `query.js`. Change the argument passed to `query(...)` to ask a different question. The answer is printed to the terminal and is based on the five most relevant retrieved passages.

Stop Qdrant when finished:

```sh
docker compose down
```

## Configuration

- Embeddings: `text-embedding-3-small`
- Chat model: `gpt-4o-mini`
- Qdrant URL: `http://localhost:6333`
- Qdrant collection: `rag-time`
- Retriever results: 5 passages

These settings are currently defined directly in `indexing.js` and `query.js`.

## Troubleshooting

- **Missing API key:** Confirm `.env` is in the project root and run the scripts with `--env-file=.env`.
- **Cannot connect to Qdrant:** Check that `docker compose up -d` completed and that port `6333` is available.
- **PDF not found:** You would need to provide a `.pdf` file. Any file will do. Check the path of the file before running the **`indexing`** program. 
- **No indexed content:** Run the indexing command successfully before querying.
