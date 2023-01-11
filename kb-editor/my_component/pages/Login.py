import streamlit as st
import json
import urllib.request

with open("designing.css") as source_des:
    st.markdown(f"<style>{source_des.read()}</style>",unsafe_allow_html=True)
for k, v in st.session_state.items():
    st.session_state[k] = v
st.session_state.refresh = 1

if "authentication_status" not in st.session_state:
    st.session_state["authentication_status"] = None

st.text_input('User ID',key='login_id')
st.text_input('Password',key='password')
if st.button('Submit'):
    try:
        data_file = 'botProperties.json'
        url = f'https://novacorpweb.azurewebsites.net/{st.session_state["login_id"]}/{data_file}'
        urllib.request.urlretrieve(url, data_file)
        with open(data_file, encoding='cp1252') as f:
            data = json.load(f)
            if data['generalSettings']['botSecret'][:11] == st.session_state.password:
                st.success('Login Sucessful')
                st.session_state["authentication_status"] = True
            else:
                st.error("Wrong Password")
                st.session_state["authentication_status"] = False
    except:
        st.error("Wrong User ID")
        st.session_state["authentication_status"] = False
else:
    pass