import streamlit as st
import json
import urllib.request
import base64

st.set_page_config(layout="wide",page_title='Novacept Connect',page_icon = 'NovaceptMark.png',initial_sidebar_state = 'auto')

# Add Designing from css file

with open("designing.css") as source_des:
    st.markdown(f"<style>{source_des.read()}</style>",unsafe_allow_html=True)
def add_bg_from_local(image_file, image_file2):
    with open(image_file, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())
    with open(image_file2, "rb") as image_file2:
        encoded_string2 = base64.b64encode(image_file2.read())
    st.markdown(
    f"""
    <style>
    [data-testid="stSidebarNav"] {{
        background-image: url(data:image/{"png"};base64,{encoded_string.decode()});
        background-repeat: no-repeat;
        background-position: 15px 47px;
        background-size: 200px auto;
    }}
    [data-testid="stHeader"] {{
        background-image: url(data:image/{"png"};base64,{encoded_string2.decode()});
        background-repeat: no-repeat;
        background-position: 46px -66px;
        background-size: 180px auto;
    }}
    </style>
    """,
    unsafe_allow_html=True
    )
add_bg_from_local('NovaceptcolorLogo.png','novaceptlogo.png')

for k, v in st.session_state.items():
    st.session_state[k] = v
st.session_state.refresh = 1

if "authentication_status" not in st.session_state:
    st.session_state["authentication_status"] = None

st.header("Login")
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