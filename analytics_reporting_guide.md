# CampusConnect Lite - Analytics & Reporting Guide

---

## 1. Introduction

### 1.1. Purpose of this Guide

This guide is intended for school administrators, principals, and other decision-makers. Its purpose is to provide a clear overview of the powerful analytics and reporting capabilities built into the CampusConnect Lite system, enabling you to make data-driven decisions for your institution.

### 1.2. Overview of Analytics Capabilities

The Analytics & Reporting module is your central hub for understanding every aspect of your school's operations. It transforms the raw data entered into the system into clear, actionable insights through a series of dashboards, charts, and exportable reports.

Key capabilities include:

- **Visual Dashboards**: At-a-glance views of key performance indicators (KPIs).
- **Trend Analysis**: Track performance and metrics over time.
- **Predictive Insights**: Identify at-risk students and potential financial issues before they escalate (mock feature).
- **AI-Powered Queries**: Use plain English to ask complex questions about your data.
- **Data Export**: Download any report in standard formats like PDF and Excel for further analysis or distribution.

---

## 2. The Analytics Hub

All reports can be accessed from the main **Analytics Hub**.

- **How to Access**: Log in with an `Admin` or `Super-Admin` account and click on **Analytics** in the main sidebar navigation. This will take you to a central page with links to all available report categories.

---

## 3. Standard Reports

### 3.1. Student Performance Reports

- **Location**: Analytics > Student Performance
- **Description**: This report provides a deep dive into the academic and behavioral profile of any individual student.
- **How to Use**:
  1. Use the dropdown menu at the top of the page to select the student you wish to analyze.
  2. The page will instantly update with the selected student's data.
- **Key Metrics Displayed**:
  - **Grade Trend**: A line chart showing the student's average performance across all major exams, making it easy to spot improvement or decline.
  - **Latest Exam Breakdown**: A bar chart showing scores in each subject for the most recent exam.
  - **Attendance Summary**: An overall attendance percentage with a visual progress bar.
  - **Disciplinary Records**: A table listing any recorded behavioral issues.

### 3.2. Financial Reports

- **Location**: Finance (Main Dashboard)
- **Description**: The main financial dashboard serves as the primary financial report, offering a complete snapshot of the school's financial health.
- **Key Metrics Displayed**:
  - **Summary Cards**: Total Income, Total Expenses, Pending Dues, and current Account Balance.
  - **Multi-Year Overview**: A line chart comparing income vs. expenses over several years to track financial trends (mock data).
  - **Fee Default Risk**: A simulated table identifying students at high risk of defaulting on payments.

### 3.3. Staff Evaluation Reports

- **Location**: Analytics > Staff Evaluation
- **Description**: This report provides insights into staff attendance and performance metrics, allowing for fair and data-informed evaluations.
- **Key Metrics Displayed**:
  - **Leave Utilization**: A bar chart comparing the percentage of used leave days for each staff member.
  - **Average Grades by Teacher (Simulated)**: A comparative chart showing the average student scores in subjects taught by each teacher.

### 3.4. Admissions & Enrollment Analytics

- **Location**: Analytics > Admissions Analytics
- **Description**: Track the effectiveness of your admissions process and identify enrollment trends over time.
- **Key Metrics Displayed**:
  - **Application Status Breakdown**: A pie chart showing the proportion of applications that are Approved, Rejected, or still Pending.
  - **Application Trends**: A line chart tracking the volume of new applications received over the last six months.

---

## 4. How to Generate & Customize Reports

### 4.1. Generating Standard Reports

All standard reports are generated automatically. Simply navigate to the relevant page (e.g., "Student Performance") to view the live, up-to-date data.

### 4.2. Customizing with the AI Query Tool

For questions that aren't answered by the standard reports, you can use the AI Query tool.

- **Location**: Analytics > AI Query
- **How to Use**:
  1. Type a question in plain English into the input box.
  2. Click the "Generate" button.
  3. The AI assistant will process your request and return a formatted, easy-to-read answer based on the (mock) data.
- **Example Queries**:
  - _"Show me a summary of staff leave utilization."_
  - _"Who are the top 5 performing students in the last exam?"_
  - _"What is the breakdown of admissions by grade for this year?"_

> **Note**: In the current version, this feature uses an AI to generate a plausible, mock response. A full implementation would connect this to your live database.

---

## 5. Export Options

You can easily download reports for meetings, record-keeping, or further analysis.

- **Supported Formats**: PDF and Microsoft Excel (.xlsx).
- **How to Export**:
  - On pages that support exporting (e.g., Finance Dashboard, Student Performance), you will find **PDF Report** and **Excel Report** buttons near the top of the page.
  - Click the desired format. The report will be generated and your browser will initiate a download.
- **Excel Reports**: The Excel exports are particularly powerful, often containing multiple worksheets with detailed data breakdowns (e.g., a summary sheet, a sheet with all invoices, and a sheet with all expenses).

---

## 6. Permissions and Access

Access to the Analytics & Reporting module is restricted to ensure data privacy and security.

- **Admin & Super-Admin Roles**: Users with these roles have full access to all reports and analytics features described in this guide.
- **Other Roles (Teacher, Student, Parent)**: These users do not have access to the centralized analytics hub. They can only view their own relevant data through their specific dashboards and profile pages.
