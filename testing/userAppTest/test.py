import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time
import requests
from functools import wraps
import errno
import os
import signal

class userAppTest(unittest.TestCase):
    def setUp(self):
        self.driver_agent = webdriver.Chrome()
        self.driver_user = webdriver.Chrome()
        # ensure dialog flow server is open with port 3005
    def tearDown(self):
        self.driver_agent.close()
        self.driver_user.close()
    
    def toXPathStringLiteral(self, s):
        if "'" not in s: return "'%s'" % s
        if '"' not in s: return '"%s"' % s
        return "concat('%s')" % s.replace("'", "',\"'\",'")

    def reset(self):        
        print("----------------------------------------------------")
        print("reseting db");
        x = requests.get("http://neobow.appspot.com/reset?availability=1")
        time.sleep(1)
        x = requests.get("http://neobow.appspot.com/reset?availability=0")
        print("----------------------------------------------------")

    def send_user_input(self, input_data):
        elemButton = self.driver_user.find_element_by_xpath("//button[@class='k-button k-flat k-button-icon k-button-send']")
        elemInput = self.driver_user.find_element_by_xpath("//input[@class='k-input']")
        elemInput.send_keys(input_data)
        time.sleep(1)
        elemButton.click()
        time.sleep(1)

    def received_data_from_agent(self, received_data):
        Xpath = "//div[@class='k-bubble'][contains(text(),{})]".format(self.toXPathStringLiteral(received_data))
        elemResult = self.driver_user.find_element_by_xpath(Xpath)
        elemResult.location_once_scrolled_into_view
        time.sleep(1)
    
    def send_agent_input(self, input_data):
        elemButton = self.driver_agent.find_element_by_xpath("//button[@class='k-button k-flat k-button-icon k-button-send']")
        elemInput = self.driver_agent.find_element_by_xpath("//input[@class='k-input']")
        elemInput.send_keys(input_data)
        time.sleep(1)
        elemButton.click()
        time.sleep(1)
    
    def received_data_from_user(self, received_data):
        Xpath = "//div[@class='k-bubble'][contains(text(),{})]".format(self.toXPathStringLiteral(received_data))
        elemResult = self.driver_agent.find_element_by_xpath(Xpath)
        elemResult.location_once_scrolled_into_view
        time.sleep(1)

    def talk_to_bot(self):
        print('talk_to_bot')
        self.driver_user.get("http://127.0.0.1:3010")
        self.actions_user = ActionChains(self.driver_user)
        wait = WebDriverWait(self.driver_user,1)
        time.sleep(10)  

        name = "Gabriel"
        self.send_user_input(name)

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'Hi there! Could I get your number next?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'Hi there! Could I get your number next?')]"))
        wait.until(elemResult)

        phone = "0123456789"
        self.send_user_input(phone)

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'What is your current problem?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'What is your current problem?')]"))
        wait.until(elemResult)

        problem = "Mobile postpaid"
        self.send_user_input(problem)

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'Is that right?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'Is that right?')]"))
        wait.until(elemResult)

        confirm = "Yes"
        self.send_user_input(confirm)

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'agent!')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'agent!')]"))
        wait.until(elemResult)

        # scroll down
        elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'agent!')]")
        elemResult.location_once_scrolled_into_view

        time.sleep(1)

    def initialize_agent(self, email, password):
        print('initialize_agent')
        self.driver_agent.get("http://127.0.0.1:3000")
        self.actions_agent = ActionChains(self.driver_agent)
        time.sleep(1)
        elem_username = self.driver_agent.find_element_by_name("email")
        elem_username.send_keys(email)
        time.sleep(1)
        elem_password = self.driver_agent.find_element_by_name("password")
        elem_password.send_keys(password)
        time.sleep(1)
        elem_login = self.driver_agent.find_element_by_xpath("//input[@class='k-button k-primary']")
        self.actions_agent.click(elem_login).perform()
        
        wait = WebDriverWait(self.driver_agent, 15)

        wait.until(EC.url_to_be("http://127.0.0.1:3000/home"))

    def timeout_helper(seconds=10, error_message=os.strerror(errno.ETIME)):
        def decorator(func):
            def _handle_timeout(signum, frame):
                raise TimeoutError(error_message)
            def wrapper(*args, **kwargs):
                signal.signal(signal.SIGALRM, _handle_timeout)
                signal.alarm(seconds)
                try:
                    result = func(*args, **kwargs)
                finally:
                    signal.alarm(0)
                return result
            return wraps(func)(wrapper)
        return decorator

    #use multiprocessing to implement timeout for agent authentication
    @timeout_helper(15)
    def initialize_agent_timeout(self, email, password):
        print('initialize_agent')
        self.driver_agent.get("http://127.0.0.1:3000")
        self.actions_agent = ActionChains(self.driver_agent)
        time.sleep(1)
        elem_username = self.driver_agent.find_element_by_name("email")
        elem_username.send_keys(email)
        time.sleep(1)
        elem_password = self.driver_agent.find_element_by_name("password")
        elem_password.send_keys(password)
        time.sleep(1)
        elem_login = self.driver_agent.find_element_by_xpath("//input[@class='k-button k-primary']")
        self.actions_agent.click(elem_login).perform()
        
        wait = WebDriverWait(self.driver_agent, 15)

        wait.until(EC.url_to_be("http://127.0.0.1:3000/home"))


        
    def test_talk_to_bot(self):
        self.reset();
        print("test_talk_to_bot")
        self.talk_to_bot()
        time.sleep(1)
        
    def test_talk_to_agent(self):
        self.reset();
        print("test_talk_to_agent")
        # use mobile postpaid  as an example
        email = "MobilePostpaid@gmail.com"
        password = "Longpassword!1"
        self.initialize_agent(email, password)
        self.talk_to_bot()

        time.sleep(10)

        # agent accept the call
        self.actions_agent = ActionChains(self.driver_agent)
        elem_accept = self.driver_agent.find_element_by_xpath("//button[contains(text(),'Accept')]")
        self.actions_agent.click(elem_accept).perform()

        wait = WebDriverWait(self.driver_agent, 2)
        wait.until(EC.presence_of_element_located((By.XPATH, "//div[contains(@class,'k-widget') and contains(@class,'k-chat')]")))

        # agent send message 
        regex = "`1234567890-=qwertyuiop\[]\\asdfghjkl;\'zxcvbnm,\.\/!@#\$%\^\&\*\(\)_\+QWERTYUIOP{\}\|ASDFGHJKL:\"ZXCVBNM<>\?"
        self.send_agent_input(regex)

        # user receive message
        self.received_data_from_agent(regex)

        # send user input
        self.send_user_input(regex)

        # agent received the input
        self.received_data_from_user(regex)

        # user send a problem statement
        problem = "Why does the last month bill charged me for more than i used?"
        self.send_user_input(problem)
        self.received_data_from_user(problem)

        # agent try to resolve it
        solution = "After checking your account, there has been slight discrepancy. I have updated your account"
        self.send_agent_input(solution)
        self.received_data_from_agent(solution)

        # ending 
        thank = "Thank you"
        self.send_user_input(thank)
        self.received_data_from_user(thank)

        self.send_agent_input("No problem")
        self.received_data_from_agent("No problem")
        # end call
    
    

    def fail_test_incorrect_password(self):
        self.reset();
        print("test_talk_to_agent")
        # use mobile postpaid  as an example
        email = "MobilePostpaid@gmail.com"
        # correct password
        # password = "Longpassword!1"
        # incorrect password
        password = "Longpassword!2"
        try:
            self.initialize_agent_timeout(email, password)
            self.talk_to_bot()

            time.sleep(10)

            # agent accept the call
            self.actions_agent = ActionChains(self.driver_agent)
            elem_accept = self.driver_agent.find_element_by_xpath("//button[contains(text(),'Accept')]")
            self.actions_agent.click(elem_accept).perform()

            wait = WebDriverWait(self.driver_agent, 2)
            wait.until(EC.presence_of_element_located((By.XPATH, "//div[contains(@class,'k-widget') and contains(@class,'k-chat')]")))

            # agent send message 
            regex = "`1234567890-=qwertyuiop\[]\\asdfghjkl;\'zxcvbnm,\.\/!@#\$%\^\&\*\(\)_\+QWERTYUIOP{\}\|ASDFGHJKL:\"ZXCVBNM<>\?"
            self.send_agent_input(regex)

            # user receive message
            self.received_data_from_agent(regex)

            # send user input
            self.send_user_input(regex)

            # agent received the input
            self.received_data_from_user(regex)

            # user send a problem statement
            problem = "Why does the last month bill charged me for more than i used?"
            self.send_user_input(problem)
            self.received_data_from_user(problem)

            # agent try to resolve it
            solution = "After checking your account, there has been slight discrepancy. I have updated your account"
            self.send_agent_input(solution)
            self.received_data_from_agent(solution)

            # ending 
            thank = "Thank you"
            self.send_user_input(thank)
            self.received_data_from_user(thank)

            self.send_agent_input("No problem")
            self.received_data_from_agent("No problem")
            # end call
        except TimeoutError as err:
            # exceptio
            print(err.args)
            print("invalid agent login credentials. check email/password?")


class TimeoutError(Exception):
    pass      


if __name__ == "__main__":
    unittest.main()
        

