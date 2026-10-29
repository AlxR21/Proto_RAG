import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import {OpenAIEmbeddings} from "@langchain/openai";
import {QdrantVectorStore} from "@langchain/qdrant";

async function generateVectorEmbeddingsForFile(filepath){
//We create a loader that loads and parses a pdf
    const loader = new PDFLoader(filepath);
    const document = await loader.load();//Already chunks data pagebypage

//Initialize the embedding model
    const embeddings = new OpenAIEmbeddings({
        model: 'text-embedding-3-small',
        apiKey: process.env.API_KEY,
    });

//A vector store for storing vector embeddings
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {url: 'http://localhost:6333',
        collectionName: 'rag-time',
        }    
    )

    await vectorStore.addDocuments(document);
    console.log("All the documents are indexed...");
    
}

generateVectorEmbeddingsForFile(<filepath>);
