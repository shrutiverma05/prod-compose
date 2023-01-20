import streamlit as st
import streamlit.components.v1 as components
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
if st.session_state["authentication_status"]:
    
    

    st.header("Edit Card")

    HtmlFile = open("Adaptive_card_designer.html", 'r', encoding='utf-8')
    source_code = HtmlFile.read()

    components.html(source_code,width=1100,height=900,scrolling=True)

elif st.session_state["authentication_status"] == False:
    st.error('Username/password is incorrect')
elif st.session_state["authentication_status"] == None:
    st.warning('Please enter your username and password')