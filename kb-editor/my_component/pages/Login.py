import streamlit as st
from streamlit_extras.switch_page_button import switch_page
import json
import urllib.request
import base64
from dotenv import load_dotenv
import os
load_dotenv()
from pathlib import Path
from streamlit.source_util import (
    page_icon_and_name, 
    calc_md5, 
    get_pages,
    _on_pages_changed
)

# Adding and deleting pages from sidebar

def delete_page(main_script_path_str, page_name):

    current_pages = get_pages(main_script_path_str)

    for key, value in current_pages.items():
        if value['page_name'] == page_name:
            del current_pages[key]
            break
        else:
            pass
    _on_pages_changed.send()

def add_page(main_script_path_str, page_name):
    
    pages = get_pages(main_script_path_str)
    main_script_path = Path(main_script_path_str)
    pages_dir = main_script_path.parent / "pages"
    # st.write(list(pages_dir.glob("*.py"))+list(main_script_path.parent.glob("*.py")))
    script_path = [f for f in list(pages_dir.glob("*.py"))+list(main_script_path.parent.glob("*.py")) if f.name.find(page_name) != -1][0]
    script_path_str = str(script_path.resolve())
    pi, pn = page_icon_and_name(script_path)
    psh = calc_md5(script_path_str)
    pages[psh] = {
        "page_script_hash": psh,
        "page_name": pn,
        "icon": pi,
        "script_path": script_path_str,
    }
    _on_pages_changed.send()

st.set_page_config(layout="wide",page_title='Novacept Connect',page_icon = 'NovaceptMark.png',initial_sidebar_state = 'auto')

# Add Designing from css file

with open("designing.css") as source_des:
    st.markdown(f"<style>{source_des.read()}</style>",unsafe_allow_html=True)

# Adding Images from local

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

# Login and Password Text fields

st.header("Login")
st.text_input('User ID',key='login_id')
st.text_input('Password',key='password')

# Submit Button

if st.button('Submit'):
    try:
        data_file = 'botProperties.json'
        url = f'{os.environ["FTPurl"]}{st.session_state["login_id"]}/{data_file}'
        urllib.request.urlretrieve(url, data_file)
        with open(data_file, encoding='cp1252') as f:
            data = json.load(f)
            if data['generalSettings']['botSecret'][:11] == st.session_state.password:
                st.success('Login Sucessful')
                st.session_state["authentication_status"] = True
                st.experimental_set_query_params(
                    username=st.session_state.login_id
                )
            else:
                st.error("Wrong Password")
                st.session_state["authentication_status"] = False
    except:
        st.error("Wrong User ID")
        st.session_state["authentication_status"] = False
else:
    pass

# Remove other pages

delete_page("Knowledgebase", "Create_Card")
delete_page("Knowledgebase", "Knowledgebase")

# Change page on Login

if st.session_state["authentication_status"] == True:
    add_page("Knowledgebase", "Knowledgebase")
    switch_page("Knowledgebase")