// ==UserScript==
// @name         HST eChart Task Alert 2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Checks tasks in Task Manager without opening the tab.
// @match        https://hstasp14.hstpathways.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

function fetchTasks() {
    // Making an AJAX request to the Task Manager tab URL
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://hstasp14.hstpathways.com/UPSC/HSTeChart/Home/GetTaskManagerForm?pageNo=1",
        onload: function(response) {
            // Handle the response
            if (response.status === 200 && response.responseText) {
                checkTasks(response.responseText);
            } else {
                console.error("Failed to fetch tasks:", response.statusText);
            }
        },
        onerror: function(error) {
            console.error("Error fetching tasks:", error);
        }
    });
}

function checkTasks(html) {
    // You need to parse the HTML response to find the number of tasks
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const taskCountElement = doc.querySelector('#taskResultPanel ul li span small');

    if (taskCountElement) {
        const taskCountText = taskCountElement.textContent;
        const taskCountMatch = taskCountText.match(/Total (\d+) tasks/);

        if (taskCountMatch && taskCountMatch.length > 1) {
            const taskCount = parseInt(taskCountMatch[1], 10);
            if (taskCount > 0) {
                alert(`You have ${taskCount} tasks waiting to be completed.`);
            }
        } else {
            console.log("Unable to determine task count or no tasks found.");
        }
    } else {
        console.log("Task count element not found in the response.");
    }
}

// Run the task check periodically (every 5 minutes, for example)
setInterval(fetchTasks, 30000); // 300000 milliseconds = 5 minutes

// Also check immediately when the page loads
document.addEventListener('DOMContentLoaded', fetchTasks);
