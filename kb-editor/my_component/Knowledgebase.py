import os
import streamlit.components.v1 as components
from dotenv import load_dotenv
import os
load_dotenv()

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = False

# Declare a Streamlit component. `declare_component` returns a function
# that is used to create instances of the component. We're naming this
# function "_component_func", with an underscore prefix, because we don't want
# to expose it directly to users. Instead, we will create a custom wrapper
# function, below, that will serve as our component's public API.

# It's worth noting that this call to `declare_component` is the
# *only thing* you need to do to create the binding between Streamlit and
# your component frontend. Everything else we do in this file is simply a
# best practice.

if not _RELEASE:
    _component_func = components.declare_component(
        # We give the component a simple, descriptive name ("my_component"
        # does not fit this bill, so please choose something better for your
        # own component :)
        "my_component",
        # Pass `url` here to tell Streamlit that the component will be served
        # by the local dev server that you run via `npm run start`.
        # (This is useful while your component is in development.)
        # url="http://localhost:8051/"
        url=os.environ['nodeURL']
    )
else:
    # When we're distributing a production version of the component, we'll
    # replace the `url` param with `path`, and point it to to the component's
    # build directory:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("my_component", path=build_dir)


# Create a wrapper function for the component. This is an optional
# best practice - we could simply expose the component function returned by
# `declare_component` and call it done. The wrapper allows us to customize
# our component's API: we can pre-process its input args, post-process its
# output value, and add a docstring for users.

def my_component(botProp,name, key=None):
    """Create a new instance of "my_component".

    Parameters
    ----------
    name: str
        The name of the thing we're saying hello to. The component will display
        the text "Hello, {name}!"
    key: str or None
        An optional key that uniquely identifies this component. If this is
        None, and the component's arguments are changed, the component will
        be re-mounted in the Streamlit frontend and lose its current state.

    Returns
    -------
    int
        The number of times the component's "Click Me" button has been clicked.
        (This is the value passed to `Streamlit.setComponentValue` on the
        frontend.)

    """
    # Call through to our private component function. Arguments we pass here
    # will be sent to the frontend, where they'll be available in an "args"
    # dictionary.
    #
    # "default" is a special argument that specifies the initial return
    # value of the component before the user has interacted with it.
    component_value = _component_func(botProp=botProp, name=name, key=key, default=0)

    # We could modify the value returned from the component if we wanted.
    # There's no need to do this in our simple example - but it's an option.
    return component_value


# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run my_component/__init__.py`
if not _RELEASE:
    import streamlit as st
    from streamlit_javascript import st_javascript
    from streamlit_extras.switch_page_button import switch_page
    import csv
    import time
    import ftplib
    import urllib.request
    import requests
    import json
    from math import ceil
    import base64
    import sys
    import extra_streamlit_components as stx
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
    
    delete_page("Knowledgebase", "Login")
    delete_page("Knowledgebase", "Create_Card")

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

    # Check Login Authentication

    if "authentication_status" not in st.session_state:
        st.session_state["authentication_status"] = None
    if st.session_state["authentication_status"]:
        try:
            if "login_id" not in st.session_state:
                st.session_state.login_id = st.experimental_get_query_params()["username"][0]
        except:
            st.header("")
            st.header("Please press rerun")
        if "page" in st.session_state:
            st.session_state.page = st.session_state.page

        # Title of the page

        st.title(f'Knowledge Base for {st.session_state.login_id}')

        # Getting Botproperties file

        data_file = 'botProperties.json'
        url = f'{os.environ["FTPurl"]}{st.session_state["login_id"]}/{data_file}'
        urllib.request.urlretrieve(url, data_file)
        with open(data_file, encoding='cp1252') as botp:
            botProperties = json.load(botp)

        # Initialize Session state keys

        if "num_questions" not in st.session_state:
            st.session_state.num_questions = 0

        if "question" not in st.session_state:
            st.session_state.question = []

        if "answer" not in st.session_state:
            st.session_state.answer = []

        if "qindex" not in st.session_state:
            st.session_state.qindex = []

        if "refresh" not in st.session_state:
            st.session_state.refresh = 0
        
        if "change" not in st.session_state:
            st.session_state.change = False

        # for k, v in st.session_state.items():
        #     st.session_state[k] = v

        # Button Functions

        def delete_qna(i):
            st.session_state['qindex'].pop(i)
            st.session_state['answer'].pop(i)
            st.session_state['question'].pop(i)
            st.session_state["num_questions"] -= 1

        def delete_question(i,j):
            st.session_state.qindex[i] -= 1
            st.session_state['question'][i].pop(j)
        
        def edit_card(i,j,ans):
            k = "editcard"
            adata = json.dumps(ans)
            st_javascript(f"sessionStorage.setItem('{k}', JSON.stringify({adata}));")
            st.session_state["editcard"] = [i,j]
            st.session_state.change = True
        
        def delete_card(i,j):
            if j != len(st.session_state.carousel) - 2:
                st.session_state.answer[i] = st.session_state.answer[i][:st.session_state.carousel[j]] + st.session_state.answer[i][st.session_state.carousel[j+1]+4 if j == 0 else st.session_state.carousel[j+1]:]
            else:
                st.session_state.answer[i] = st.session_state.answer[i][:st.session_state.carousel[j]]
            st.session_state[f"card_{i}"].pop(j)
        
        def add_card(i):
            st.session_state.refresh=1
            st.session_state.answer[i] = st.session_state.answer[i] +'''/??/{"type": "AdaptiveCard","$schema": "http://adaptivecards.io/schemas/adaptive-card.json","version": "1.6","body": []}'''
            st.session_state[f"card_{i}"].append('''{"type": "AdaptiveCard","$schema": "http://adaptivecards.io/schemas/adaptive-card.json","version": "1.6","body": []}''')

        # Updating the edit made on the Adaptivecard in Create card page using cookies

        @st.cache(allow_output_mutation=True)
        def get_manager():
            return stx.CookieManager()
        cookie_manager = get_manager()
        cookies = cookie_manager.get_all()
        value = cookie_manager.get(cookie='changedCard')
        if value != None:
            st.session_state["changedcard"] = value
            cookie_manager.delete("changedCard")
            testv = json.dumps(st.session_state["changedcard"])
            if type(st.session_state["editcard"]) == list:
                ival = st.session_state["editcard"][0]
                jval = st.session_state["editcard"][1]
                st.session_state[f"card_{ival}"][jval] = testv
                if jval != len(st.session_state.carousel) - 2:
                    st.session_state.answer[ival] = st.session_state.answer[ival][:st.session_state.carousel[jval] if jval == 0 else st.session_state.carousel[jval]+4] + testv +  st.session_state.answer[ival][st.session_state.carousel[jval+1]:]
                else:
                    st.session_state.answer[ival] = st.session_state.answer[ival][:st.session_state.carousel[jval] if jval == 0 else st.session_state.carousel[jval]+4] + testv

            else:
                st.session_state.answer[st.session_state["editcard"]] = testv

        head1, head2 = st.columns([3,3])

        # Load the csv file from server to the session state

        if head1.button('Load'):
            head1.text('File Loaded')
            indata = []
            index = set()
            data_file = 'faq_data.csv'
            url = f'{os.environ["FTPurl"]}{st.session_state["login_id"]}/{data_file}'
            urllib.request.urlretrieve(url, data_file)
            try:
                with open(data_file, mode ='r',encoding='cp1252') as file:
                    csvFile = csv.reader(file)
                    for lines in csvFile:
                        indata.append(lines)
            except:
                with open(data_file, mode ='r') as file:
                    csvFile = csv.reader(file)
                    for lines in csvFile:
                        indata.append(lines)
            indata.pop(0)
            question = []
            ans = []
            qindex = []
            for i in range(len(indata)):
                index.add(indata[i][2])
            index = list(index)
            for i in range(len(index)):
                index[i] = int(index[i])
            for i in range(int(max(index))):
                question.append([])
                ans.append('')
            for i in indata:
                question[int(i[2])-1].append(i[0])
                ans[int(i[2])-1] = i[1]
            for i in question:
                qindex.append(len(i))
            st.session_state.num_questions = len(ans)
            st.session_state.question = question
            st.session_state.answer = ans
            st.session_state.qindex = qindex
            st.session_state.refresh = 1
        else:
            pass

        # Save the csv file back to ftp server from the session state

        if st.session_state['num_questions'] > 0:
            if head2.button('Save'):
                head2.text('File Saved')
                save = []
                fields = ['question','answer','index']
                for i in range(st.session_state['num_questions']):
                    for j in range(len(st.session_state.question[i])):
                        row = []
                        row.append(st.session_state.question[i][j])
                        row.append(st.session_state.answer[i])
                        row.append(str(i+1))
                        save.append(row)
                
                HOSTNAME = "waws-prod-db3-177.ftp.azurewebsites.windows.net"
                USERNAME = "novaeu\$novaeu"
                PASSWORD = "r8d0hfMcM1ssZ0K4jspHbQ1zwdqjH29PvMnMzFugnpyrfZ1kZfG6Yc9kJbi7"

                # Connect FTP Server
                ftp_server = ftplib.FTP(HOSTNAME, USERNAME, PASSWORD)
                
                # force UTF-8 encoding
                ftp_server.encoding = "utf-8"

                ftp_server.cwd(f'/site/wwwroot/{st.session_state["login_id"]}')
                ftp_server.delete("faq_data_old.csv")
                ftp_server.rename("faq_data.csv","faq_data_old.csv")
                filename = "faq_data.csv"
                with open(filename, "w",newline='') as csvfile:
                    csvwriter = csv.writer(csvfile) 
                    csvwriter.writerow(fields) 
                    csvwriter.writerows(save)
                with open(filename, "rb") as csvfile:
                    ftp_server.storbinary(f"STOR {filename}", csvfile)
            else:
                pass
        
        # Sidebar functionality

        with st.sidebar:

            # Increase the Total number of QnA

            if st.button("Add QnA"):
                st.session_state["num_questions"] += 1
            else:
                pass

            # Paging inputs

            page_columns = st.columns(2)
            a_per_page = page_columns[1].slider('Answers per Page',1, 30,10, key='a_per_page')
            last_page = ceil(st.session_state.num_questions/a_per_page)
            

            # Train Button
            if st.button("Train", key = "Train"):
                try:
                    # st.write('Training has begun')
                    URL = f'{os.environ["TRAIN"]}/train/{st.session_state.login_id}'
                    r = requests.get(url = URL)
                    data = r.json()
                    st.write(data)
                except:
                    st.write("A problem has occured while training, Please try logging in again")
            else:
                pass

            # Search questions
            allques = []
            for i in st.session_state.question:
                for j in i:
                    allques.append(j)
            st.selectbox('Search', allques, key='search')
            if 'sea' not in st.session_state:
                st.session_state.sea = ''
            if st.session_state.search != st.session_state.sea:
                st.session_state.sea = st.session_state.search
                sea = st.session_state.sea
                for k in range(len(st.session_state.question)):
                    if sea in st.session_state.question[k]:
                        st.write(f'The Question is on page {ceil((k+1)/a_per_page)} QnA no {k+1} and question number {st.session_state.question[k].index(sea)+1}')
                        # url = f'http://localhost:8501/#{k+1}'
                        # st.markdown("check out this [link](%s)" % url)
                        st.session_state.lol = ceil((k+1)/a_per_page)
            page = page_columns[0].selectbox('Page',range(1,last_page+1), key='lol')

            # Compare current page selection to first and last page number
            if page == 1:
                first = True
            else:
                first = False
            if page == last_page:
                last = True
            else:
                last = False

        answer_index = st.session_state.num_questions

        # Getting the range of current page

        if answer_index > 0:
            first = (page-1)*a_per_page
            next = min(first + a_per_page, answer_index)
        
        # Rendering QnA on current page

            for i in range(first,next):

                if i >= len(st.session_state.question):
                    st.session_state.question.append([])
                
                if i >= len(st.session_state.answer):
                    st.session_state.answer.append('')
                
                if i >= len(st.session_state.qindex):
                    st.session_state.qindex.append(0)

                con = st.container()
                con.subheader(f'{i+1}.')

                #Add Question to QnA
                if con.button("Add Questions", key = f"{i}.Add Questions"):
                    st.session_state.qindex[i] += 1
                else:
                    pass
                
                # Creating columns for All Questions and an Answer of current QnA
                
                col1, col2, col3= con.columns([3, 0.6, 3])
                col1.text("Questions")
                col3.text("Answer")

                # Rendering all questions of current QnA

                for j in range(st.session_state.qindex[i]):
                    if j >= len(st.session_state.question[i]):
                        st.session_state.question[i].append('')
                    
                    st.session_state.question[i][j] = col1.text_input(
                        f"question_{i}_{j}",
                        label_visibility="collapsed",
                        value = st.session_state.question[i][j]
                    )

                    # Delete particular question in QnA
                    col2.button("🗑", help="delete", key = f"{i}.{j}.❌", on_click=delete_question, args=[i,j])
                
                # Rendering the Answer

                with col3:
                    if st.session_state.answer[i] == '':

                        # Create card Button
                        if st.button("Create card", key = f"{i+1}.Create card"):
                            st.session_state.refresh=1
                            st.session_state.answer[i] = '''{"type": "AdaptiveCard","$schema": "http://adaptivecards.io/schemas/adaptive-card.json","version": "1.6","body": []}'''
                        else:
                            pass

                        # Create carousel Button
                        if st.button("Create carousel", key = f"{i+1}.Create carousel"):
                            st.session_state.refresh=1
                            st.session_state.answer[i] = '''{"type": "AdaptiveCard","$schema": "http://adaptivecards.io/schemas/adaptive-card.json","version": "1.6","body": []}/??/{"type": "AdaptiveCard","$schema": "http://adaptivecards.io/schemas/adaptive-card.json","version": "1.6","body": []}'''
                        else:
                            pass

                    # Check if Input is Adaptive card or normal text or Carousel
                    
                    if st.session_state.answer[i].find('/??/') == -1:
                        try:

                            # Adaptive card

                            ans=json.loads(st.session_state.answer[i])
                            num_clicks = my_component(botProperties,ans, key='Foo '+str(i+1)+' Answer')
                            k = "editcard"
                            adata = json.dumps(ans)

                            # Edit card
                            if st.button("Edit", key = f"{i+1}.Edit"):
                                st_javascript(f"sessionStorage.setItem('{k}', JSON.stringify({adata}));")
                                st.session_state["editcard"] = i
                                st.session_state.change = True
                            else:
                                pass

                            # Delete card
                            if st.button("Delete card", key = f"{i+1}.Delete card"):
                                st.session_state.refresh=1
                                st.session_state.answer[i] = ''
                            else:
                                pass
                        except:

                            # Normal Text

                            st.session_state.answer[i] = st.text_area(f"ans_{i}", label_visibility="collapsed", value=st.session_state.answer[i])
                    else:

                        # Carousel
                        # String slicing to get Carousel seperator indexes
                        st.session_state.carousel = [0]
                        for j in range(len(st.session_state.answer[i])-4):
                            if st.session_state.answer[i][j:j+4] == '/??/':
                                st.session_state.carousel.append(j)
                        st.session_state.carousel.append(len(st.session_state.answer[i]))
                        if f"card_{i}" not in st.session_state:
                            st.session_state[f"card_{i}"] = []
                            for j in range(len(st.session_state.carousel)-1):
                                st.session_state[f"card_{i}"].append('')
                        
                        try:

                            # Render Cards and Buttons
                            for j in range(len(st.session_state[f"card_{i}"])):
                                ans=json.loads(st.session_state[f"card_{i}"][j])
                                num_clicks = my_component(botProperties,ans, key='Foo '+str(i+1)+str(j+1)+' Answer')
                                st.button("Edit", key = f"{i+1}.{j+1}.Edit", on_click=edit_card, args=[i,j,ans])
                                st.button("Delete", key = f"{i+1}.{j+1}.Delete card", on_click=delete_card, args=[i,j])
                                
                        except:

                            # Initialize Cards
                            for j in range(len(st.session_state.carousel)-1):
                                st.session_state[f"card_{i}"][j] = st.session_state.answer[i][st.session_state.carousel[j] if j == 0 else st.session_state.carousel[j]+4 :st.session_state.carousel[j+1]]
                        
                        # Add card
                        st.button("Add Card", key = f"{i+1}.{j+1}.Add card", on_click=add_card, args=[i])

                # Delete QnA
                con.button("Delete QnA", key = f"{i}.Delete QnA", on_click=delete_qna, args=[i])
                con.text("-------------------------------------------------------------------------------------------------------------------------")
        
        # Refresh page
        with st.spinner():
            if st.session_state.refresh==1:
                st.session_state.refresh = 0
                time.sleep(3)
                st.experimental_rerun()

        # Change page
        if st.session_state.change == True:
            st.session_state.change = False
            time.sleep(3)
            add_page("Knowledgebase", "Create Card")
            switch_page("Create Card")

    # If user is not Logged in

    elif st.session_state["authentication_status"] == False:
        add_page("Knowledgebase", "Login")
        switch_page("Login")
        st.error('Username/password is incorrect')
    elif st.session_state["authentication_status"] == None:
        add_page("Knowledgebase", "Login")
        switch_page("Login")
        st.warning('Please enter your username and password')
