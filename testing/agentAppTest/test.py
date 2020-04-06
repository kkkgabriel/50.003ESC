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

    def toXPathStringLiteral(self, s):
        if "'" not in s: return "'%s'" % s
        if '"' not in s: return '"%s"' % s
        return "concat('%s')" % s.replace("'", "',\"'\",'")

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

    def log_in_success(self):
        self.driver_agent.get("http://127.0.0.1:3000")
        self.actions_agent = ActionChains(self.driver_agent)
        time.sleep(5)
        elem_username = self.driver_agent.find_element_by_name("email")
        elem_username.send_keys("MobilePostpaid@gmail.com")
        time.sleep(1)
        elem_password = self.driver_agent.find_element_by_name("password")
        elem_password.send_keys("Longpassword!1")
        time.sleep(1)
        elem_login = self.driver_agent.find_element_by_xpath("//input[@class='k-button k-primary']")
        self.actions_agent.click(elem_login).perform()
        wait = WebDriverWait(self.driver_agent, 15)
        wait.until(EC.url_to_be("http://127.0.0.1:3000/home"))

    def establishing_connection(self):
        #initialising
        self.log_in_success()
        self.actions_user = ActionChains(self.driver_user)
        self.driver_user.get("http://127.0.0.1:4000")
        time.sleep(2)

    def initialize_user_and_agent_connection(self, user_name = "Gabriel", phone = "0123456789", problem = "Mobile Postpaid"):
        self.establishing_connection()
        
        self.send_user_input(user_name)
        wait = WebDriverWait(self.driver_user, 1)
        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'Hi there! Could I get your number next?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'Hi there! Could I get your number next?')]"))
        wait.until(elemResult)

        self.send_user_input(phone)

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'What is your current problem?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'What is your current problem?')]"))
        wait.until(elemResult)

        self.send_user_input(problem)

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'Is that right?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'Is that right?')]"))
        wait.until(elemResult)

        confirm = "yes"
        self.send_user_input(confirm)

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'agent!')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'agent!')]"))
        wait.until(elemResult)

        # scroll down
        elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'agent!')]")
        elemResult.location_once_scrolled_into_view

        time.sleep(1)


    def ongoing_conversation(self):
        self.initialize_user_and_agent_connection()
        time.sleep(2)
        self.actions_agent = ActionChains(self.driver_agent)

        elem_accept = self.driver_agent.find_element_by_xpath("//button[contains(text(),'Accept')]")
        self.actions_agent.click(elem_accept).perform()
        
        time.sleep(1)
        
    def t_login_success(self):
        print("Testing login")
        self.log_in_success()
        print("Pass login test")

    def t_login_logout(self):
        print("Testing logout")
        self.log_in_success()
        self.actions_agent = ActionChains(self.driver_agent)
        try:
            elem_logout = self.driver_agent.find_element_by_xpath("//button[contains(text(),'Logout')]")
            self.actions_agent.click(elem_logout).perform()
            time.sleep(1)
            print("Pass logout test")
        except:
            print("Failed to logout")

    def t_accept_incoming_convo(self):
        print("Testing accepting conversation")
        self.initialize_user_and_agent_connection()
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

    def t_decline_incoming_convo(self):
        print("Testing declining conversation")
        self.initialize_user_and_agent_connection()
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

    def t_send_message(self):
        print("Testing sending message")
        self.ongoing_conversation()
        time.sleep(2)
        #sends a message to user
        regex = "`1234567890-=qwertyuiop\[]\\asdfghjkl;'zxcvbnm,\.\/!@#\$%\^\&\*\(\)_\+QWERTYUIOP{\}\|ASDFGHJKL:\"ZXCVBNM<>\?"
        self.send_agent_input(regex)
        self.received_data_from_agent(regex)
        print("Pass send message")
    
    def test_take_a_break(self):
        print("Testing taking a break")
        self.log_in_success()

        time.sleep(1)
        elem_button = self.driver_agent.find_element_by_xpath("//button[contains(text(),'break')]")
        elem_button.click()
        time.sleep(1)
        elem_status = self.driver_agent.find_element_by_xpath("//span/span[text()='Unavailable']")
        elem_button.click()
        time.sleep(1)
        elem_status = self.driver_agent.find_element_by_xpath("//span/span[text()='Available']")

        print("Pass taking a break")
    
    
    def tearDown(self):
        self.driver_agent.close()
        self.driver_user.close()
        
if __name__ == "__main__":
    unittest.main()
