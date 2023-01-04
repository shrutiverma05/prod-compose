FROM python:3.10
WORKDIR  '/app'
COPY api.py ./
RUN pip install farm-haystack
RUN pip install fastapi
RUN pip install uvicorn

CMD ["uvicorn", "api:app", "--host", "0.0.0.0","--port", "8000","--reload"]