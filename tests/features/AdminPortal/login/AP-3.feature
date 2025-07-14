Feature: Admin Portal login


    Scenario: Login with unauthorized account credentials - invalid username and password
        Given the user lands on Admin Portal login page
        And the user fills in with username 'qaautoo' and password 'Test1234'
        When the user clicks Sign In button
        Then the user sees "Invalid username or password." message pop up
