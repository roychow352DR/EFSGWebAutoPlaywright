Feature: Admin Portal login


    Scenario: Login End to End flow
        Given the user lands on Admin Portal login page
        And the user fills in with username 'qaauto' and password 'Test1234@'
        When the user clicks Sign In button
        Then the user sees Menu display on the screen