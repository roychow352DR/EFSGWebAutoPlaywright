Feature: Admin Portal login

@Test
    Scenario: Login with empty value
        Given the user lands on Admin Portal login page
        When the user input nothing as username and password
        Then the user sees the Sign In button is unclickable

