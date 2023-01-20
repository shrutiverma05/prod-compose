import os
import streamlit.components.v1 as components

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
        url="http://nova14uat.northeurope.cloudapp.azure.com:8051",
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
    import csv
    import time
    import ftplib
    import urllib.request
    import json
    from math import ceil

    for k, v in st.session_state.items():
        st.session_state[k] = v
    st.set_page_config(layout="wide")
    with open("designing.css") as source_des:
        st.markdown(f"<style>{source_des.read()}</style>",unsafe_allow_html=True)
    if "authentication_status" not in st.session_state:
        st.session_state["authentication_status"] = None
    if st.session_state["authentication_status"]:
        
        data_file = 'botProperties.json'
        url = f'https://novacorpweb.azurewebsites.net/{st.session_state["login_id"]}/{data_file}'
        urllib.request.urlretrieve(url, data_file)
        with open(data_file, encoding='cp1252') as botp:
            botProperties = json.load(botp)
        # num_click = _component_func(botProp=botProperties, key=None, default=0)
        # from PIL import Image
        # image = Image.open('novacept.webp')
        # st.image(image, width=100)

        def update_card(i,j):
            for k in range(j):
                if k != j - 1:
                    st.session_state[f"card_{i}_{k}"] = st.session_state[f"ans_{i}"][st.session_state.carousel[k] if k == 0 else st.session_state.carousel[k]+4 :st.session_state.carousel[k+1]]
                else:
                    st.session_state[f"card_{i}_{k}"] = st.session_state[f"ans_{i}"][st.session_state.carousel[k] if k == 0 else st.session_state.carousel[k]+4 :]



        st.title('Novacept Knowledge Base')

        if "num_questions" not in st.session_state:
            st.session_state.num_questions = 0
        
        if "refresh" not in st.session_state:
            st.session_state.refresh = 0

        st.session_state["changedcard"] = st_javascript(f"JSON.parse(sessionStorage.getItem('changedcard'));")       
        if st.session_state["changedcard"] == 0:
            pass
        else:
            st_javascript(f"(sessionStorage.removeItem('changedcard'));")
            st_javascript(f"(sessionStorage.removeItem('editcard'));")
            testv = json.dumps(st.session_state["changedcard"])
            st.session_state[st.session_state["editcard"]] = testv
            if st.session_state["editcard"][:4] == 'card':
                under = []
                for i in range(len(st.session_state["editcard"])):
                    if st.session_state["editcard"][i] == '_':
                        under.append(i)
                ival = int(st.session_state["editcard"][5:int(under[1])])
                jval = int(st.session_state["editcard"][int(under[1])+1:])
                
                if jval != len(st.session_state.carousel) - 1:
                    st.session_state[f"ans_{ival}"] = st.session_state[f"ans_{ival}"][:st.session_state.carousel[jval] if jval == 0 else st.session_state.carousel[jval]+4] + testv +  st.session_state[f"ans_{ival}"][st.session_state.carousel[jval+1]:]
                else:
                    st.session_state[f"ans_{ival}"] = st.session_state[f"ans_{ival}"][:st.session_state.carousel[jval] if jval == 0 else st.session_state.carousel[jval]+4] + testv
                
        head1, head2 = st.columns([3,3])
        if head1.button('Load'):
            head1.write('File Loaded')
            indata = []
            index = set()
            data_file = 'faq_data.csv'
            url = f'https://novacorpweb.azurewebsites.net/{st.session_state["login_id"]}/{data_file}'
            urllib.request.urlretrieve(url, data_file)
            with open(data_file, mode ='r',encoding='cp1252') as file:
                csvFile = csv.reader(file)
                for lines in csvFile:
                    indata.append(lines)
            indata.pop(0)
            question = []
            ans = []
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
            st.session_state.num_questions = len(ans)
            for i in range(st.session_state.num_questions):
                st.session_state[f"qa_num_{i}"] = len(question[i])
                st.session_state[f"ans_{i}"] = ans[i]
                for j in range(st.session_state[f"qa_num_{i}"]):
                    st.session_state[f"question_{i}_{j}"] = question[i][j]
            st.session_state.refresh = 1
        else:
            pass

        if head2.button('Save'):
            head2.write('File Saved')
            save = []
            fields = ['question','answer','index']
            for i in range(st.session_state['num_questions']):
                for j in range(st.session_state[f"qa_num_{i}"]):
                    row = []
                    row.append(st.session_state[f"question_{i}_{j}"])
                    row.append(st.session_state[f"ans_{i}"])
                    row.append(str(i+1))
                    save.append(row)
            
            HOSTNAME = "waws-prod-bay-153.ftp.azurewebsites.windows.net"
            USERNAME = "novaCorpWeb\$novaCorpWeb"
            PASSWORD = "B4sdhvCuwvH9XTCohRJhuQPf01n4xf0phPz2N1L0XlKY6sNWb0DkxxlTbpnu"

            # Connect FTP Server
            ftp_server = ftplib.FTP(HOSTNAME, USERNAME, PASSWORD)
            
            # force UTF-8 encoding
            ftp_server.encoding = "utf-8"

            ftp_server.cwd(f'/site/wwwroot/{st.session_state["login_id"]}')
            filename = "faq_data.csv"
            with open(filename, "w",newline='') as csvfile:
                csvwriter = csv.writer(csvfile) 
                csvwriter.writerow(fields) 
                csvwriter.writerows(save)
            with open(filename, "rb") as csvfile:
                ftp_server.storbinary(f"STOR {filename}", csvfile)
        else:
            pass

        with st.sidebar:
            num_questions = st.number_input(
                "QnA Pairs",
                min_value=0,
                step=1,
                key="num_questions",
            )
            page_columns = st.columns(2)
            a_per_page = page_columns[1].slider('Answers per Page',1, 30,15, key='a_per_page')
            last_page = ceil(num_questions/a_per_page)
            page = page_columns[0].selectbox('Page',range(1,last_page+1))

            # Compare current page selection to first and last page number
            if page == 1:
                first = True
            else:
                first = False
            if page == last_page:
                last = True
            else:
                last = False
            
        
        # df_a = st.session_state.answer
        # df_q = st.session_state.question
        answer_index = st.session_state.num_questions

        if answer_index > 0:
            first = (page-1)*a_per_page
            next = min(first + a_per_page, answer_index)

            for i in range(first,next):
                if f"qa_num_{i}" not in st.session_state:
                    st.session_state[f"qa_num_{i}"] = 0

                if f"ans_{i}" not in st.session_state:
                    st.session_state[f"ans_{i}"] = ""

                con = st.container()
                qa_num = con.number_input(
                    str(i + 1) + ". Add or remove Questions",
                    min_value=0,
                    step=1,
                    key=f"qa_num_{i}",
                )
                col1, col2 = con.columns([5, 5])
                for j in range(qa_num):
                    if f"question_{i}_{j}" not in st.session_state:
                        st.session_state[f"question_{i}_{j}"] = ""

                    col1.text_input(
                        "Questions",
                        label_visibility="visible" if j == 0 else "collapsed",
                        key=f"question_{i}_{j}",value = st.session_state[f"question_{i}_{j}"]
                    )

                with col2:
                    if f"ans_{i}" not in st.session_state:
                        st.session_state[f"ans_{i}"] = ''
                    if st.session_state[f"ans_{i}"] == '':
                        if st.button(f"{i+1}.Create card"):
                            st.session_state.refresh=1
                            st.session_state[f"ans_{i}"] = '''{"type": "AdaptiveCard","$schema": "http://adaptivecards.io/schemas/adaptive-card.json","version": "1.6","body": []}'''
                        else:
                            pass
                        if st.button(f"{i+1}.Create carousel"):
                            st.session_state.refresh=1
                            st.session_state[f"ans_{i}"] = '''{"type": "AdaptiveCard","$schema": "http://adaptivecards.io/schemas/adaptive-card.json","version": "1.6","body": []}/??/{"type": "AdaptiveCard","$schema": "http://adaptivecards.io/schemas/adaptive-card.json","version": "1.6","body": []}'''
                        else:
                            pass
                    else:
                        pass
                    
                    if st.session_state[f"ans_{i}"].find('/??/') == -1:
                        try:
                            ans=json.loads(st.session_state[f"ans_{i}"])
                            num_clicks = my_component(botProperties,ans, key='Foo '+str(i+1)+' Answer')
                            k = "editcard"
                            adata = json.dumps(ans)
                            if st.button(f"{i+1}.Edit"):
                                st_javascript(f"sessionStorage.setItem('{k}', JSON.stringify({adata}));")
                                st.session_state["editcard"] = f"ans_{i}"
                            else:
                                pass
                            if st.button(f"{i+1}.Delete card"):
                                st.session_state.refresh=1
                                st.session_state[f"ans_{i}"] = ''
                            else:
                                pass
                        except:
                            st.text_area(
                                "Answer",
                                key=f"ans_{i}",value = st.session_state[f"ans_{i}"]
                                ) 
                    else:
                        st.session_state.carousel = [0]
                        for j in range(len(st.session_state[f"ans_{i}"])-4):
                            if st.session_state[f"ans_{i}"][j:j+4] == '/??/':
                                st.session_state.carousel.append(j)
                        
                        for j in range(len(st.session_state.carousel)):
                            if f"card_{i}_{j}" not in st.session_state:
                                st.session_state[f"card_{i}_{j}"] = ''
                            try:
                                ans=json.loads(st.session_state[f"card_{i}_{j}"])
                                num_clicks = my_component(botProperties,ans, key='Foo '+str(i+1)+str(j+1)+' Answer')
                                k = "editcard"
                                adata = json.dumps(ans)
                                if st.button(f"{i+1}.{j+1}.Edit"):
                                    st_javascript(f"sessionStorage.setItem('{k}', JSON.stringify({adata}));")
                                    st.session_state["editcard"] = f"card_{i}_{j}"
                                else:
                                    pass
                                if st.button(f"{i+1}.{j+1}.Delete card"):
                                    st.session_state.refresh=1
                                    # for k in range(len(st.session_state.carousel)):
                                    #     del st.session_state[f"card_{i}_{k}"]
                                        
                                    if j != len(st.session_state.carousel) - 1:
                                        st.session_state[f"ans_{i}"] = st.session_state[f"ans_{i}"][:st.session_state.carousel[j]] + st.session_state[f"ans_{i}"][st.session_state.carousel[j+1]+4 if j == 0 else st.session_state.carousel[j+1]:]
                                    else:
                                        st.session_state[f"ans_{i}"] = st.session_state[f"ans_{i}"][:st.session_state.carousel[j]]
                                    update_card(i,len(st.session_state.carousel))
                                    # for k in range(len(st.session_state.carousel)):
                                    #     if k != len(st.session_state.carousel) - 1:
                                    #         st.session_state[f"card_{i}_{k}"] = st.session_state[f"ans_{i}"][st.session_state.carousel[k] if k == 0 else st.session_state.carousel[k]+4 :st.session_state.carousel[k+1]]
                                    #     else:
                                    #         st.session_state[f"card_{i}_{k}"] = st.session_state[f"ans_{i}"][st.session_state.carousel[k] if k == 0 else st.session_state.carousel[k]+4 :]
                                else:
                                    pass

                                # if st.button(f"{i+1}.{j+1}.Add card"):
                                #     st.session_state.refresh=1
                                #     if j != len(st.session_state.carousel) - 1:
                                #         st.session_state[f"ans_{i}"] = st.session_state[f"ans_{i}"][:st.session_state.carousel[j] if j == 0 else st.session_state.carousel[j]+4] +'''{"type": "AdaptiveCard","$schema": "http://adaptivecards.io/schemas/adaptive-card.json","version": "1.6","body": []}/??/'''+ st.session_state[f"ans_{i}"][st.session_state.carousel[j]+4:]
                                #     else:
                                #         st.session_state[f"ans_{i}"] = st.session_state[f"ans_{i}"][:st.session_state.carousel[j] if j == 0 else st.session_state.carousel[j]+4] +'''{"type": "AdaptiveCard","$schema": "http://adaptivecards.io/schemas/adaptive-card.json","version": "1.6","body": []}'''
                                #     # st.session_state[f"card_{i}_{j+1}"] = '''{"type": "AdaptiveCard","$schema": "http://adaptivecards.io/schemas/adaptive-card.json","version": "1.6","body": []}'''
                                # else:
                                #     pass
                                
                            except:
                                if j != len(st.session_state.carousel) - 1:
                                    st.session_state[f"card_{i}_{j}"] = st.session_state[f"ans_{i}"][st.session_state.carousel[j] if j == 0 else st.session_state.carousel[j]+4 :st.session_state.carousel[j+1]]
                                else:
                                    st.session_state[f"card_{i}_{j}"] = st.session_state[f"ans_{i}"][st.session_state.carousel[j] if j == 0 else st.session_state.carousel[j]+4 :]
                        if st.button(f"{i+1}.Add card"):
                            st.session_state.refresh=1
                            st.session_state[f"ans_{i}"] = st.session_state[f"ans_{i}"] +'''/??/{"type": "AdaptiveCard","$schema": "http://adaptivecards.io/schemas/adaptive-card.json","version": "1.6","body": []}'''
                            st.session_state[f"card_{i}_{j+1}"] = '''{"type": "AdaptiveCard","$schema": "http://adaptivecards.io/schemas/adaptive-card.json","version": "1.6","body": []}'''
                        else:
                            pass
                        
        if st.session_state.refresh==1:
            st.session_state.refresh = 0
            time.sleep(3)
            st.experimental_rerun()
    elif st.session_state["authentication_status"] == False:
        st.error('Username/password is incorrect')
    elif st.session_state["authentication_status"] == None:
        st.warning('Please enter your username and password')
# print(st.session_state["card_44_0"])
# print(st.session_state["card_44_1"])
# print(st.session_state["card_44_2"])
# print(st.session_state["card_44_3"])
# print(st.session_state["card_44_4"])
# print("---------------------------------------------------------------------------------------------------")