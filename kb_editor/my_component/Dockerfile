FROM python:3.8

WORKDIR '/app'
COPY . /app

RUN pip install streamlit
RUN pip install streamlit_javascript


EXPOSE 8501
EXPOSE 8080

CMD ["streamlit", "run", "__init__.py"]