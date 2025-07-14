Feature: AO Application List
  
  Scenario Outline: Account status in Pending Deposit after second approval
    Given the user logged in to Admin Portal as username 'aoadmin02' and password 'P@ssw0rd!'
    When the user clicks detail button of "Pending Approval" record on the application page
    And the user clicks "Next to Personal Information" button on the application information page
    And the user clicks "Next to Contact Information" button on the personal information page
    And the user clicks "Next to Employee and Financial Information" button on the contact information page
    And the user clicks "Next to Trading Experience" button on the employee & financial information page
    And the user clicks "Approve" button on the trading experience page
    And the user selects "Pass eKYC" as verify reason on the verify pop up
    And the user clicks "Confirm" button on the trading experience page
    Then the user sees a record in "Pending Deposit" status is created on the application list
