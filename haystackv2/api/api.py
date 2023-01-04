# RUN uvicorn api:app --reload --port 8000
from fastapi import FastAPI
import os
from haystack.document_stores import ElasticsearchDocumentStore
from haystack.nodes import EmbeddingRetriever
from haystack.pipelines import FAQPipeline

index_names = ['haytest','vootours','gts']
document_store = []
retriever = []
pipe = []
host = os.environ.get("ELASTICSEARCH_HOST", "localhost")
app = FastAPI()

for i in range(len(index_names)):
    document_store.append(ElasticsearchDocumentStore(
        host=host,
        username="",
        password="",
        index=index_names[i],
        embedding_field="question_emb",
        embedding_dim=384,
        excluded_meta_data=["question_emb"],
        similarity="cosine",
    ))

    retriever.append(EmbeddingRetriever(
        document_store=document_store[i],
        embedding_model="sentence-transformers/all-MiniLM-L6-v2",
        use_gpu=True,
        scale_score=False,
    ))

    pipe.append(FAQPipeline(retriever=retriever[i]))

@app.get('/query/'+index_names[0])
async def query(q):
    return pipe[0].run(query=q, params={"Retriever": {"top_k": 2}})

@app.get('/query/'+index_names[1])
async def query(q):
    return pipe[1].run(query=q, params={"Retriever": {"top_k": 2}})

@app.get('/query/'+index_names[2])
async def query(q):
    return pipe[2].run(query=q, params={"Retriever": {"top_k": 2}})

# @app.get("/initialized")
# def check_status():
#     """
#     This endpoint can be used during startup to understand if the
#     server is ready to take any requests, or is still loading.

#     The recommended approach is to call this endpoint with a short timeout, 
#     like 500ms, and in case of no reply, consider the server busy.
#     """
#     return True    




# @app.get('/query/'+index_names[3])
# async def query(q):
#     return pipe[3].run(query=q, params={"Retriever": {"top_k": 2}})

# @app.get('/query/'+index_names[4])
# async def query(q):
#     return pipe[4].run(query=q, params={"Retriever": {"top_k": 2}})