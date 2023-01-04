import streamlit as st
import streamlit.components.v1 as components
st.set_page_config(layout="wide")
with open("designing.css") as source_des:
    st.markdown(f"<style>{source_des.read()}</style>",unsafe_allow_html=True)
for k, v in st.session_state.items():
    st.session_state[k] = v
st.session_state.refresh = 1
if "authentication_status" not in st.session_state:
    st.session_state["authentication_status"] = None
if st.session_state["authentication_status"]:
    
    

    st.header("Edit Card")

    HtmlFile = open("Adaptive_card_designer.html", 'r', encoding='utf-8')
    source_code = HtmlFile.read()

    components.html(source_code,width=1100,height=900,scrolling=True)

elif st.session_state["authentication_status"] == False:
    st.error('Username/password is incorrect')
elif st.session_state["authentication_status"] == None:
    st.warning('Please enter your username and password')