import {OpenAIEmbeddings} from "@langchain/openai";
import {QdrantVectorStore} from "@langchain/qdrant";
import {OpenAI} from "openai";

const client = new OpenAI({
    apiKey: process.env.API_KEY
})

async function query(userQuery){
    //Convert userQuery into vector embeddings
    const embeddings = new OpenAIEmbeddings({
        model: 'text-embedding-3-small',
        apiKey: process.env.API_KEY,
    });
    //Search for similar vectors in the VECTORSTORE
     const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {url: 'http://localhost:6333',
        collectionName: 'rag-time',
        }    
    )

    const vectorRetriever = vectorStore.asRetriever({k : 5});
    const result = await vectorRetriever.invoke(userQuery);
    //Fetch those chunks and feed those to the LLM model.
    const SYSTEM_PROMPT = `You're an literature prof. who answers user query based on the context provided in the document and not from anything beyond.

    Also answer the page number relevant to the query 
    
    User Document:
    ${result.map(e => JSON.stringify({pageContent: e.pageContent, pageNumber: e.metadata.loc.pageNumber})).join('\n\n')}
    `;

      const llmResponse = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          max_completion_tokens:  500,
        messages: [
            {role: 'system', content: SYSTEM_PROMPT},
            {role: 'user', content: userQuery}
        ],
      })

      console.log((await llmResponse).choices[0].message.content);
      
}

query("What is the narrator going through")