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

    def establishing_connection(self):
        #initialising
        self.actions_agent = ActionChains(self.driver_agent)
        self.actions_user = ActionChains(self.driver_user)
        self.driver_user.get("http://127.0.0.1:3000")
        self.driver_agent.get("http://127.0.0.1:3333/home")
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
        elem_accept = self.driver_agent.find_element_by_xpath("//button[contains(text(),'Accept')]")
        self.actions_agent.click(elem_accept).perform()
        
    def test_accept_incoming_convo(self):
        self.establishing_connection()
        #check for open dialog
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
            print("failed test")

    def test_decline_incoming_convo(self):
        self.establishing_connection()
        #check for open dialog
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
