import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time

class PythonOrgSearch(unittest.TestCase):

    def setUp(self):
        self.driver_agent = webdriver.Chrome()
        self.driver_user = webdriver.Chrome()
    def log_in_success(self):
        self.driver_agent.get("http://127.0.0.1:3000")
        self.actions_agent = ActionChains(self.driver_agent)
        time.sleep(10)
        elem_username = self.driver_agent.find_element_by_name("email")
        elem_username.send_keys("AccountsNBills@gmail.com")
        time.sleep(2)
        elem_password = self.driver_agent.find_element_by_name("password")
        elem_password.send_keys("Longpassword!1")
        time.sleep(2)
        elem_login = self.driver_agent.find_element_by_xpath("//input[@class='k-button k-primary']")
        self.actions_agent.click(elem_login).perform()
        time.sleep(2)

    def establishing_connection(self):
        #initialising
        self.log_in_success()
        self.actions_user = ActionChains(self.driver_user)
        self.driver_user.get("http://127.0.0.1:4000")
        time.sleep(10)
        #establishing connection through start
        elem_accounts_and_bills = self.driver_user.find_element_by_xpath("//button[contains(text(),'Accounts and Bills')]")
        self.actions_user.click(elem_accounts_and_bills).perform()
        time.sleep(2)
        elem_input = self.driver_user.find_element_by_xpath("//input[@id='msgInput']")
        elem_input.send_keys("start")
        time.sleep(2)
        elem_input.send_keys(Keys.RETURN)

    def ongoing_conversation(self):
        self.establishing_connection()
        time.sleep(2)
        self.actions_agent = ActionChains(self.driver_agent)

        elem_accept = self.driver_agent.find_element_by_xpath("//button[contains(text(),'Accept')]")
        self.actions_agent.click(elem_accept).perform()
        
    def test_login_success(self):
        self.driver_agent.get("http://127.0.0.1:3000")
        self.actions_agent = ActionChains(self.driver_agent)
        time.sleep(10)
        elem_username = self.driver_agent.find_element_by_name("email")
        elem_username.send_keys("AccountsNBills@gmail.com")
        time.sleep(2)
        elem_password = self.driver_agent.find_element_by_name("password")
        elem_password.send_keys("Longpassword!1")
        time.sleep(2)
        elem_login = self.driver_agent.find_element_by_xpath("//input[@class='k-button k-primary']")
        self.actions_agent.click(elem_login).perform()
        time.sleep(10)
        if self.driver_agent.current_url == "http://127.0.0.1:3000/home":
            print("pass test_login_success")
        else:
            print("failed test_login_success")
    
    def test_accept_incoming_convo(self):
        self.establishing_connection()
        #check for open dialog
        self.actions_agent = ActionChains(self.driver_agent)

        time.sleep(2)
        try:
            elem_accept = self.driver_agent.find_element_by_xpath("//button[contains(text(),'Accept')]")
            # print("accept button found")
            self.actions_agent.click(elem_accept).perform()
        except:
            print("dialog was not opened.")
        time.sleep(2)

        try:
            elem_chat = self.driver_agent.find_element_by_xpath("//div[@class='k-widget k-chat']")
            print("passed test_accept_incoming_convo")
        except:
            print("failed test_accept_incoming_convo")

    def test_decline_incoming_convo(self):
        self.establishing_connection()
        #check for open dialog
        self.actions_agent = ActionChains(self.driver_agent)

        time.sleep(2)
        try:
            elem_accept = self.driver_agent.find_element_by_xpath("//button[contains(text(),'Decline')]")
            self.actions_agent.click(elem_accept).perform()
        except:
            print("dialog was not opened.")
        time.sleep(5)
        try:
            elem_chat = self.driver_agent.find_element_by_xpath("//div[@class='k-widget k-chat']")
            print("failed test_accept_decline_convo")
        except:
            print("passed test_accept_decline_convo")

    def test_send_message(self):
        self.ongoing_conversation()
        time.sleep(2)
        #sends a message to user
        try:
            elem_input = self.driver_agent.find_element_by_class_name("k-input")
        except:
            print("error in finding input")
        try:
            #sends every single possible key input
            regex = "`1234567890-=qwertyuiop\[]\\asdfghjkl;'zxcvbnm,\.\/!@#\$%\^\&\*\(\)_\+QWERTYUIOP{\}\|ASDFGHJKL:\"ZXCVBNM<>\?"
            elem_input.send_keys(regex)
        except:
            print("error in sending input")
        time.sleep(2)
        elem_input.send_keys(Keys.RETURN)
        time.sleep(2)
        try:
            xpath = "/html[1]/body[1]/div[1]/div[1]/p[2]"
            self.driver_user.find_element_by_xpath(xpath)
            print("passed text_send_message")
        except:
            print("text is not received properly")
            print("test_send_message failed.")
        
    def tearDown(self):
        self.driver_agent.close()
        self.driver_user.close()

if __name__ == "__main__":
    unittest.main()
