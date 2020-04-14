import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time


class PythonOrgSearch(unittest.TestCase):
    taga = "HomeLine"
    tagb ="Broadband"
    def log_out_a1(self):
        logout = self.driver_agent_a1.find_element_by_xpath("//button[@class='btn btn-danger']")
        self.actions_agent_a1 = ActionChains(self.driver_agent_a1)
        self.actions_agent_a1.click(logout).perform()
        time.sleep(5)
        self.driver_agent_a1.close()


    def log_out_a2(self):
        logout = self.driver_agent_a2.find_element_by_xpath("//button[@class='btn btn-danger']")
        self.actions_agent_a2.click(logout).perform()
        time.sleep(5)
        self.driver_agent_a2.close()

    def log_out_b1(self):
        logout = self.driver_agent_b1.find_element_by_xpath("//button[@class='btn btn-danger']")
        self.actions_agent_b1.click(logout).perform()
        time.sleep(5)
        self.driver_agent_b1.close()

    def log_out_b2(self):
        logout = self.driver_agent_b2.find_element_by_xpath("//button[@class='btn btn-danger']")
        self.actions_agent_b2.click(logout).perform()
        time.sleep(5)
        self.driver_agent_b2.close()

    def send_user1_input(self, input_data):
        elemButton = self.driver_user1.find_element_by_xpath("//button[@class='k-button k-flat k-button-icon k-button-send']")
        elemInput = self.driver_user1.find_element_by_xpath("//input[@class='k-input']")
        elemInput.send_keys(input_data)
        time.sleep(1)
        elemButton.click()
        time.sleep(1)

    def send_user2_input(self, input_data):
        elemButton = self.driver_user2.find_element_by_xpath("//button[@class='k-button k-flat k-button-icon k-button-send']")
        elemInput = self.driver_user2.find_element_by_xpath("//input[@class='k-input']")
        elemInput.send_keys(input_data)
        time.sleep(1)
        elemButton.click()
        time.sleep(1)

    def user1_communicate(self):
        self.driver_user1 = webdriver.Chrome()
        self.driver_user1.maximize_window()
        self.driver_user1.get("http://127.0.0.1:3010")
        self.driver_user1.maximize_window()
        time.sleep(5)
        self.send_user1_input("gabriel")
        wait = WebDriverWait(self.driver_user1, 1)
        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'Hi there! Could I get your number next?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'Hi there! Could I get your number next?')]"))
        wait.until(elemResult)

        self.send_user1_input("82241234")

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'What is your current problem?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'What is your current problem?')]"))
        wait.until(elemResult)

        self.send_user1_input(self.taga)

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'Is that right?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'Is that right?')]"))
        wait.until(elemResult)

        confirm = "Yes"
        self.send_user1_input(confirm)

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'agent!')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'agent!')]"))
        wait.until(elemResult)

        # scroll down
        elemResult = self.driver_user1.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'agent!')]")
        elemResult.location_once_scrolled_into_view
        time.sleep(1)

    def user2_communicate(self):
        self.driver_user2 = webdriver.Chrome()
        self.driver_user2.maximize_window()
        self.driver_user2.get("http://127.0.0.1:3010")
        self.driver_user2.maximize_window()
        time.sleep(5)
        self.send_user2_input("gabriel")
        wait = WebDriverWait(self.driver_user2, 1)
        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'Hi there! Could I get your number next?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'Hi there! Could I get your number next?')]"))
        wait.until(elemResult)

        self.send_user2_input("82241234")

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'What is your current problem?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'What is your current problem?')]"))
        wait.until(elemResult)

        self.send_user2_input(self.taga)

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'Is that right?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'Is that right?')]"))
        wait.until(elemResult)

        confirm = "Yes"
        self.send_user2_input(confirm)

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'agent!')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'agent!')]"))
        wait.until(elemResult)

        # scroll down
        elemResult = self.driver_user2.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'agent!')]")
        elemResult.location_once_scrolled_into_view
        time.sleep(1)
  
    def user3_communicate(self):
        self.driver_user3 = webdriver.Chrome()
        self.driver_user3.maximize_window()
        self.driver_user3.get("http://127.0.0.1:3010")
        self.driver_user3.maximize_window()
        time.sleep(5)
        self.send_user3_input("gabriel")
        wait = WebDriverWait(self.driver_user3, 1)
        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'Hi there! Could I get your number next?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'Hi there! Could I get your number next?')]"))
        wait.until(elemResult)

        self.send_user3_input("82241234")

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'What is your current problem?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'What is your current problem?')]"))
        wait.until(elemResult)

        self.send_user3_input(self.taga)

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'Is that right?')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'Is that right?')]"))
        wait.until(elemResult)

        confirm = "Yes"
        self.send_user3_input(confirm)

        # elemResult = self.driver_user.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'agent!')]")
        elemResult = EC.presence_of_element_located((By.XPATH,"//div[@class='k-bubble'][contains(text(),'agent!')]"))
        wait.until(elemResult)

        # scroll down
        elemResult = self.driver_user3.find_element_by_xpath("//div[@class='k-bubble'][contains(text(),'agent!')]")
        elemResult.location_once_scrolled_into_view
        time.sleep(1)

    def log_in_a1(self):
        self.driver_agent_a1 = webdriver.Chrome()
        self.driver_agent_a1.maximize_window()
        self.driver_agent_a1.get("http://127.0.0.1:3000")
        self.actions_agent_a1 = ActionChains(self.driver_agent_a1)
        time.sleep(5)
        elem_username = self.driver_agent_a1.find_element_by_name("email")
        elem_username.send_keys(self.taga+"@gmail.com")
        time.sleep(1)
        elem_password = self.driver_agent_a1.find_element_by_name("password")
        elem_password.send_keys("Longpassword!1")
        time.sleep(1)
        elem_login = self.driver_agent_a1.find_element_by_xpath("//input[@class='k-button k-primary']")
        self.actions_agent_a1.click(elem_login).perform()
        wait = WebDriverWait(self.driver_agent_a1, 15)
        wait.until(EC.url_to_be("http://127.0.0.1:3000/home"))
    
    def log_in_a2(self):
        self.driver_agent_a2 = webdriver.Chrome()
        self.driver_agent_a2.maximize_window()
        self.driver_agent_a2.get("http://127.0.0.1:3000")
        self.actions_agent_a2 = ActionChains(self.driver_agent_a2)
        time.sleep(5)
        elem_username = self.driver_agent_a2.find_element_by_name("email")
        elem_username.send_keys(self.taga+"2"+"@gmail.com")
        time.sleep(1)
        elem_password = self.driver_agent_a2.find_element_by_name("password")
        elem_password.send_keys("Longpassword!1")
        time.sleep(1)
        elem_login = self.driver_agent_a2.find_element_by_xpath("//input[@class='k-button k-primary']")
        self.actions_agent_a2.click(elem_login).perform()
        wait = WebDriverWait(self.driver_agent_a2, 15)
        wait.until(EC.url_to_be("http://127.0.0.1:3000/home"))
        time.sleep(15)

    def log_in_b1(self):
        self.driver_agent_b1 = webdriver.Chrome()
        self.driver_agent_b1.maximize_window()
        self.driver_agent_b1.get("http://127.0.0.1:3000")
        self.actions_agent_b1 = ActionChains(self.driver_agent_b1)
        time.sleep(5)
        elem_username = self.driver_agent_b1.find_element_by_name("email")
        elem_username.send_keys(self.tagb+"@gmail.com")
        time.sleep(1)
        elem_password = self.driver_agent_b1.find_element_by_name("password")
        elem_password.send_keys("Longpassword!1")
        time.sleep(1)
        elem_login = self.driver_agent_b1.find_element_by_xpath("//input[@class='k-button k-primary']")
        self.actions_agent_b1.click(elem_login).perform()
        wait = WebDriverWait(self.driver_agent_b1, 15)
        wait.until(EC.url_to_be("http://127.0.0.1:3000/home"))
        time.sleep(15)

    def log_in_b2(self):
        self.driver_agent_b2 = webdriver.Chrome()
        self.driver_agent_b2.maximize_window()
        self.driver_agent_b2.get("http://127.0.0.1:3000")
        self.actions_agent_b2 = ActionChains(self.driver_agent_b2)
        time.sleep(5)
        elem_username = self.driver_agent_b2.find_element_by_name("email")
        elem_username.send_keys(self.tagb+"2"+"@gmail.com")
        time.sleep(1)
        elem_password = self.driver_agent_b2.find_element_by_name("password")
        elem_password.send_keys("Longpassword!1")
        time.sleep(1)
        elem_login = self.driver_agent_b2.find_element_by_xpath("//input[@class='k-button k-primary']")
        self.actions_agent_b2.click(elem_login).perform()
        wait = WebDriverWait(self.driver_agent_b2, 15)
        wait.until(EC.url_to_be("http://127.0.0.1:3000/home"))
        time.sleep(15)

    def test_busy_wait(self):
        print("rnning test_busy_wait")
        self.user1_communicate()
        time.sleep(5)
        self.log_in_a1()
        time.sleep(10)
        try:
            elem_accept = self.driver_agent_a1.find_element_by_xpath("//button[contains(text(),'Accept')]")
            # print("accept button found")
            self.actions_agent.click(elem_accept).perform()
            self.log_out_a1()
            self.driver_user1.close()


        except:
            print("failed busy_wait: dialog was not opened.")
            self.log_out_a1()
            self.driver_user1.close()


    def test_available_toggle(self):
        print("running test_available_toggle")

        self.log_in_a1()
        time.sleep(5)
        elem_toggle = self.driver_agent_a1.find_element_by_xpath("//button[@class='btn btn-light']")
        self.actions_agent_a1 = ActionChains(self.driver_agent_a1)
        self.actions_agent_a1.click(elem_toggle).perform()
        time.sleep(2)
        self.user1_communicate()
        time.sleep(5)
        elem_toggle = self.driver_agent_a1.find_element_by_xpath("//button[@class='btn btn-light']")
        self.actions_agent_a1 = ActionChains(self.driver_agent_a1)
        self.actions_agent_a1.click(elem_toggle).perform()
        time.sleep(5)
        try:
            elem_accept = self.driver_agent_a1.find_element_by_xpath("//button[contains(text(),'Accept')]")
            # print("accept button found")
            self.actions_agent_a1.click(elem_accept).perform()
            self.log_out_a1()
            self.driver_user1.close()


        except:
            print("failed busy_wait: dialog was not opened.")
            self.log_out_a1()
            self.driver_user1.close()

    def test_reroute(self):
        print("running test reroute")
        self.log_in_a1()
        self.log_in_a2()
        self.user1_communicate()
        time.sleep(5)
        try:
            elem_accept = self.driver_agent_a1.find_element_by_xpath("//button[contains(text(),'Accept')]")
            # print("accept button found")
            self.actions_agent_a1.click(elem_accept).perform()
            elem_reroute = self.driver_agent_a1.find_element_by_xpath
            self.actions_agent_a1.click(elem_reroute).perform()
            try:
                elem_accept = self.driver_agent_a2.find_element_by_xpath("//button[contains(text(),'Accept')]")
                # print("accept button found")
                print("passed test_reroute")
                self.log_out_a1()
                self.log_out_a2()
                self.driver_user1.close()
                self.driver_user2.close()
    
            except:
                print("failed test_reroute")
                self.log_out_a1()
                self.log_out_a2()
                self.driver_user1.close()
                self.driver_user2.close()

        except:
            elem_accept = self.driver_agent_a2.find_element_by_xpath("//button[contains(text(),'Accept')]")
            # print("accept button found")
            self.actions_agent_a2.click(elem_accept).perform()
            time.sleep(5)
            elem_reroute = self.driver_agent_a2.find_element_by_xpath
            self.actions_agent_a2.click(elem_reroute).perform()
            try:
                elem_accept = self.driver_agent_a1.find_element_by_xpath("//button[contains(text(),'Accept')]")
                # print("accept button found")
                print("passed test_reroute")
                self.log_out_a1()
                self.log_out_a2()
                self.driver_user1.close()
                self.driver_user2.close()
            
            except:
                print("failed test_reroute")
                self.log_out_a1()
                self.log_out_a2()
                self.driver_user1.close()
                self.driver_user2.close()

    def test_multiple_queues(self):
        print("running test_multiple_queues")
        self.log_in_a1
        self.log_in_b1
        self.user1_communicate
        self.user3_communicate
        try:
            elem_accepta = self.driver_agent_a1.find_element_by_xpath("//button[contains(text(),'Accept')]")
            elem_acceptb= self.driver_agent_b1.find_element_by_xpath("//button[contains(text(),'Accept')]")
            print("passed test_multiple_queues")
            self.log_out_a1
            self.log_out_b1
            self.driver_user1.close()
            self.driver_user3.close()
        except:
            print("failed test_multiple_queues")
            self.log_out_a1
            self.log_out_b1
            self.driver_user1.close()
            self.driver_user3.close()

        
if __name__ == "__main__":
    unittest.main()
