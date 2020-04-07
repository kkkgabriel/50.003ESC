import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time


class PythonOrgSearch(unittest.TestCase):
    tag = "AccountsNBills"
    def setUp(self):
        self.driver_agent = webdriver.Chrome()
        self.driver_user = webdriver.Chrome()
    
    def log_out1(self):
        logout = self.driver_agent.find_element_by_xpath("//button[@class='btn btn-danger']")
        self.actions_agent.click(logout).perform()
        time.sleep(5)
    
    def log_out2(self):
        logout = self.driver_agent_2.find_element_by_xpath("//button[@class='btn btn-danger']")
        self.actions_agent_2.click(logout).perform()
        time.sleep(5)
        self.driver_agent_2.close()

    def send_user_input(self, input_data):
        elemButton = self.driver_user.find_element_by_xpath("//button[@class='k-button k-flat k-button-icon k-button-send']")
        elemInput = self.driver_user.find_element_by_xpath("//input[@class='k-input']")
        elemInput.send_keys(input_data)
        time.sleep(1)
        elemButton.click()
        time.sleep(1)

    def user1_communicate(self):
        self.driver_user.get("http://127.0.0.1:3010")
        time.sleep(5)
        self.send_user_input("gabriel")
        wait = WebDriverWait(self.driver_user, 1)
        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'Hi there! Could I get your number next?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'Hi there! Could I get your number next?')]"))
        wait.until(elemResult)

        self.send_user_input("82241234")

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'What is your current problem?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'What is your current problem?')]"))
        wait.until(elemResult)

        self.send_user_input(self.tag)

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
        
    def log_in_1(self):
        self.driver_agent.get("http://127.0.0.1:3000")
        self.actions_agent = ActionChains(self.driver_agent)
        time.sleep(5)
        elem_username = self.driver_agent.find_element_by_name("email")
        elem_username.send_keys(self.tag+"@gmail.com")
        time.sleep(1)
        elem_password = self.driver_agent.find_element_by_name("password")
        elem_password.send_keys("Longpassword!1")
        time.sleep(1)
        elem_login = self.driver_agent.find_element_by_xpath("//input[@class='k-button k-primary']")
        self.actions_agent.click(elem_login).perform()
        wait = WebDriverWait(self.driver_agent, 15)
        wait.until(EC.url_to_be("http://127.0.0.1:3000/home"))
    
    def log_in_2(self):
        self.driver_agent_2 = webdriver.Chrome()
        self.driver_agent_2.get("http://127.0.0.1:3000")
        self.actions_agent_2 = ActionChains(self.driver_agent_2)
        time.sleep(5)
        elem_username = self.driver_agent_2.find_element_by_name("email")
        elem_username.send_keys(self.tag+"2"+"@gmail.com")
        time.sleep(1)
        elem_password = self.driver_agent_2.find_element_by_name("password")
        elem_password.send_keys("Longpassword!1")
        time.sleep(1)
        elem_login = self.driver_agent_2.find_element_by_xpath("//input[@class='k-button k-primary']")
        self.actions_agent_2.click(elem_login).perform()
        wait = WebDriverWait(self.driver_agent_2, 15)
        wait.until(EC.url_to_be("http://127.0.0.1:3000/home"))
        time.sleep(15)

    # def test_busy_wait(self):
    #     self.user1_communicate()
    #     time.sleep(5)
    #     self.log_in_1()
    #     time.sleep(10)
    #     try:
    #         elem_accept = self.driver_agent.find_element_by_xpath("//button[contains(text(),'Accept')]")
    #         # print("accept button found")
    #         self.actions_agent.click(elem_accept).perform()
    #         self.log_out1()
    #         self.log_out2()

    #     except:
    #         print("failed busy_wait: dialog was not opened.")
    #         self.log_out1()
    #         self.log_out2()

    def test_available_toggle(self):
        self.log_in_1()
        time.sleep(5)
        elem_toggle = self.driver_agent.find_element_by_xpath("//button[@class='btn btn-light']")
        self.actions_agent.click(elem_toggle).perform()
        time.sleep(2)
        self.user1_communicate()
        time.sleep(5)
        elem_toggle = self.driver_agent.find_element_by_xpath()
        self.actions_agent.click(elem_toggle).perform()
        time.sleep(5)
        try:
            elem_accept = self.driver_agent.find_element_by_xpath("//button[contains(text(),'Accept')]")
            # print("accept button found")
            self.actions_agent.click(elem_accept).perform()
            self.log_out1()
            self.log_out2()

        except:
            print("failed busy_wait: dialog was not opened.")
            self.log_out1()
            self.log_out2()

    def test_reroute(self):
        self.log_in_1()
        self.log_in_2()
        self.user1_communicate()
        time.sleep(5)
        try:
            elem_accept = self.driver_agent.find_element_by_xpath("//button[contains(text(),'Accept')]")
            # print("accept button found")
            self.actions_agent.click(elem_accept).perform()
            elem_reroute = self.driver_agent.find_element_by_xpath
            self.actions_agent.click(elem_reroute).perform()
            try:
                elem_accept = self.driver_agent_2.find_element_by_xpath("//button[contains(text(),'Accept')]")
                # print("accept button found")
                print("passed test_reroute")
                self.log_out1()
                self.log_out2()

            except:
                print("failed test_reroute")
                self.log_out1()
                self.log_out2()

        except:
            elem_accept = self.driver_agent_2.find_element_by_xpath("//button[contains(text(),'Accept')]")
            # print("accept button found")
            self.actions_agent_2.click(elem_accept).perform()
            time.sleep(5)
            elem_reroute = self.driver_agent_2.find_element_by_xpath
            self.actions_agent.click(elem_reroute).perform()
            try:
                elem_accept = self.driver_agent.find_element_by_xpath("//button[contains(text(),'Accept')]")
                # print("accept button found")
                print("passed test_reroute")
                self.log_out1()
                self.log_out2()
                
            except:
                print("failed test_reroute")
                self.log_out1()
                self.log_out2()



    def tearDown(self):
        self.driver_agent.close()
        self.driver_user.close()
        
if __name__ == "__main__":
    unittest.main()
