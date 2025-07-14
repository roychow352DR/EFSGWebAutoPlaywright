Feature: AO Application List
  @Test
  Scenario Outline: Account status in Spec. Approval for Pending Deposit after first approve reason
    Given the user logged in to Admin Portal as username 'qaauto' and password 'Test1234@'
    When the user clicks detail button of "Pending Deposit" record on the application page
    And the user clicks "Activate live trading account" button on the application information page
    And the user selects "Verify the Applicants in real person" as verify reason on the activate live trade account pop up
    And the user clicks "Confirm" button on the application information page
    Then the user sees a record in "Spec. Approval for Pending Deposit" status is created on the application list