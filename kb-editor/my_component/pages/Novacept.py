import streamlit as st
from streamlit_extras.switch_page_button import switch_page
for k, v in st.session_state.items():
    st.session_state[k] = v
switch_page("Knowledgebase")