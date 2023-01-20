#Running haystack.py file

FROM python:3.10

WORKDIR  '/app'
COPY Haystack.py ./
RUN pip install farm-haystack 
RUN pip install fastapi
RUN pip install uvicorn
#ENTRYPOINT : /bin/sh -c
EXPOSE 8001
CMD ["python","./Haystack.py"]

