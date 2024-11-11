# Employee and Customer portal 

## Instructional Video: https://youtu.be/UVQ1dNwZEP0

## Employee Instructions:
1. navigate to the "server" folder, open command prompt, enter 'npm run dev'
2. navigate to the "portal-client" folder, open command prompt, enter 'npm run dev'
3. Enter the localhost URL (provided in the "portal-client" command prompt) into your browser.
4. Click on the Employee Login Link.

The **Static Login** details are as follows:

Username: employeemaster@gmail.com
Password: Master786Employee531!



## Customer Instructions:
1. navigate to the "server" folder, open command prompt, enter 'npm run dev'
2. navigate to the "portal-client" folder, open command prompt, enter 'npm run dev'
3. Enter the localhost URL (provided in the "portal-client" command prompt) into your browser.
	

**Login** with existing user details:

Email: daud24cassim@gmail.com
Account Number: 1234
Password: Daud1Cassim

You may also **register** a new user by navigating to the relevant page.

formatting for payment page
	
	Name: 		'Name'
	amount: 	'0000000'
	currency: 	N/A
	SWIFT code: 	'AAAA BB CC XXX' example -> "HBUKGB4BXXX"
	card no.: 	16 digit number
	cvv: 		3 digit number
	Epire date: 	MM/YY

## Password security with password hashing

### bcrypt
- **Protects Against: Credit Card Theft, Brute Force Attacks**
  - **Password Hashing**: bcrypt is used to hash passwords before they are stored in the database. Rather than storing plain text passwords, bcrypt ensures that even if the database is compromised, the original passwords cannot be easily retrieved.
  - **Salting**: bcrypt automatically adds a unique salt to each password before hashing, making it resistant to rainbow table attacks. This means even identical passwords will have different hashes.
  - **Adaptive Hashing**: bcrypt’s hashing algorithm can be configured to increase the work factor over time, making it more resistant to brute force attacks as computing power improves.

 (White, 2024)

## RegEx input whitelisting for registration, login, and payments

Whitelisting inputs ensures that only allowed data is processed, significantly reducing the risk of malicious attacks such as SQL injection, cross-site scripting (XSS), and other forms of attacks.

### 1. Registration and Login
- **Protects Against: SQL Injection, Cross-Site Scripting (XSS), Brute Force Attacks**
- **Whitelisting user inputs** ensures that only valid and expected data is accepted during the registration and login processes. For example, usernames, emails, and passwords are strictly checked against allowed patterns 
  - This approach prevents the injection of malicious SQL queries or scripts into form fields, stopping attackers from attempting SQL injection or XSS attacks.
  - Additionally this reduces the surface area for brute force attacks by rejecting any inputs that do not meet specific criteria.

### 2. Payments
- **Protects Against: Payment Fraud, SQL Injection, Cross-Site Scripting (XSS)**
  - When processing sensitive payment information, whitelisting ensures that only valid payment data (e.g., numeric fields for credit card numbers, specific formats for expiration dates, and CVV codes) is processed.
  - This prevents attackers from submitting malicious scripts or tampering with payment forms, which could lead to fraud or data leakage.
  - By validating and whitelisting inputs, you also reduce the chance of inadvertently processing corrupted or malicious data, ensuring that only legitimate transactions are accepted.

### Benefits of whitelisting inputs
- **Prevents Malicious Data Submission**: Only data that conforms to expected patterns is accepted, reducing the risk of common attacks such as SQL injection or XSS.
- **Improves Data Integrity**: By strictly controlling what can be input, the application ensures that only valid, safe data is processed and stored.
- **Enhances User Experience**: Whitelisting also helps guide users by providing clear feedback if their inputs don’t match expected formats (e.g., invalid email addresses), improving form validation and reducing errors.

(Oftedal, Input validation)

By enforcing strict input validation and whitelisting in key areas like registration, login, and payments, the application ensures that user data is secure and impervious to common attack methods.

# Payment Portal Security

This payment portal is protected against several types of attacks using a combination of various security measures and best practices. Below is an explanation of how the app defends against session jacking, clickjacking, SQL injection, cross-site scripting (XSS), man-in-the-middle (MITM) attacks, and distributed denial of service (DDoS) attacks.

## Security Measures Implemented

### 1. Protected routes and authentication (AuthProvider)
- **Protects Against: Session Jacking, Cross-Site Scripting (XSS)**
  - **Session Jacking Prevention**: The protected routes included in our customer portal ensure that only authenticated users can access sensitive parts of the application. The `AuthProvider` manages authentication tokens securely, and tokens are expired or refreshed 
     regularly to reduce the risk of session hijacking.
  - **XSS Prevention**: By carefully managing user input and output, the application prevents the injection of malicious scripts. React’s automatic encoding and strong content security policies also help mitigate XSS attacks.
  (Bhimani & Purohit, 2023)

### 2. SSL (Secure Sockets Layer)
- **Protects Against: Man-in-the-Middle (MITM) Attacks**
  - SSL encrypts data between the client and server, preventing unauthorized interception. It also verifies the server's identity to the client, ensuring the connection is secure and protected from eavesdropping.
    (CloudFare, What is SSL (secure sockets layer)? | cloudflare)

### 3. MongoDB for storing information
- **Protects Against: SQL Injection Attacks**
  - MongoDB uses a NoSQL and document based approach, avoiding traditional SQL queries that are vulnerable to SQL injection attacks. By using proper query parameterization and input validation, the application ensures that no malicious database manipulations occur.
    (Marić, 2024)

### 4. Cross-Site Scripting (XSS) protection
  - React’s automatic DOM encoding protects against XSS by escaping user inputs. Additionally, all input is validated, thus ensuring that no malicious scripts are executed in users' browsers.
    (Gangwar, 2023)

### 6. DDoS attack mitigation
  - auto-scaling is used on our server infrastructure to automatically allocate additional resources when traffic spikes, ensuring that that the payment portal service can handle unexpected surges of traffic.
    (A. Bremler-Barr, E. Brosh and M. Sides, "DDoS attack on cloud auto-scaling mechanisms", 2017)

## Additional security measures

### Helmet
- **Protects Against: Cross-Site Scripting (XSS) and Clickjacking**
  - Helmet is a middleware that helps secure Express apps by setting various HTTP headers. It strengthens security by:
    - **Preventing XSS**: Helmet.js includes a feature that sets the `Content-Security-Policy` header, which helps prevent XSS attacks by controlling which resources (scripts, images, etc.) are allowed to be loaded by the browser.
    - **Preventing Clickjacking**: Clickjacking essentially tricks the user into clicking on something they don't see. Helmet.js sets the X-Frame-Options header, and in turn mitigates the possibility of our site being embedded in frames, thus preventing any possible 
      clickjacking attempts.
      (Amitha, 2024)

## DevSecOps
- Testing was performed with Jest and performs the necessary tests to ensure that all of our secure API calls work as expected

## References

- White, M. (2024) how tough is bcrypt to crack? and can it keep passwords safe?, Specops Software. Available at: https://specopssoft.com/blog/hashing-algorithm-cracking-bcrypt-passwords/ (Accessed: 07 October 2024). 
- Oftedal, E. (no date) Input validation, Input Validation - an overview | ScienceDirect Topics. Available at: https://www.sciencedirect.com/topics/computer-science/input-validation (Accessed: 07 October 2024). 
- Bhimani, K. and Purohit, R. (2023) Secure react applications with authprovider, Building Secure React Applications with AuthProvider. Available at: https://www.dhiwise.com/post/how-authprovider-enhances-user-authentication-in-react (Accessed: 07 October 2024).
- CloudFare (no date) What is SSL (secure sockets layer)? | cloudflare, What is SSL? | SSL definition. Available at: https://www.cloudflare.com/learning/ssl/what-is-ssl/ (Accessed: 07 October 2024).
- Marić, N. (2024) SQL injection in mongodb: Examples and prevention, Bright Security. Available at: https://brightsec.com/blog/sql-injection-in-mongodb-examples-and-prevention/ (Accessed: 07 October 2024).
- Gangwar, A. (2023) XSS attacks in react apps and how to prevent them., Medium. Available at: https://abhishek-gangwar.medium.com/xss-attacks-in-react-apps-and-how-to-prevent-them-cfafd2369dc5 (Accessed: 07 October 2024).
- A. Bremler-Barr, E. Brosh and M. Sides, "DDoS attack on cloud auto-scaling mechanisms," IEEE INFOCOM 2017 - IEEE Conference on Computer Communications, Atlanta, GA, USA, 2017, pp. 1-9, doi: 10.1109/INFOCOM.2017.8057010.
- Amitha (2024) Strengthening node.js security with Helmet.js, Enhance Node.js Security with Helmet.js: A Practical Guide. Available at: https://www.linkedin.com/pulse/strengthening-nodejs-security-helmetjs-amitha-h-vggof#:~:text=XSS%20attacks%20are%20like%20graffiti,approved%20content%20to%20be%20displayed. (Accessed: 07 October 2024). 




