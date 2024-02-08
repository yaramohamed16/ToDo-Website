// ToDo.js

import React, { useState, useEffect } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { openDB } from "idb";

function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchTasksFromIndexedDB();
  }, []);

  const fetchTasksFromIndexedDB = async () => {
    try {
      const db = await openDB("ToDoListDB", 1, {
        upgrade(db) {
          db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
        },
      });

      const tx = db.transaction("tasks", "readonly");
      const store = tx.objectStore("tasks");
      const tasks = await store.getAll();
      setTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks from IndexedDB:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const db = await openDB("ToDoListDB", 1);
        const tx = db.transaction("tasks", "readwrite");
        const store = tx.objectStore("tasks");

        if (editIndex !== null) {
          // Update existing task
          const updatedTask = { id: tasks[editIndex].id, task: newTask };
          await store.put(updatedTask);
          setEditIndex(null);
        } else {
          // Add new task
          await store.add({ task: newTask });

          // Alert for successful addition
          alert("Task successfully added!");
        }

        // Fetch updated tasks from IndexedDB
        fetchTasksFromIndexedDB();

        setNewTask("");
      } catch (error) {
        console.error("Error adding task to IndexedDB:", error);
      }
    }
  };

  const removeTask = async (index) => {
    try {
      const db = await openDB("ToDoListDB", 1);
      const tx = db.transaction("tasks", "readwrite");
      const store = tx.objectStore("tasks");

      // Remove task from IndexedDB
      await store.delete(tasks[index].id);

      // Fetch updated tasks from IndexedDB
      fetchTasksFromIndexedDB();

      setEditIndex(null);
      setNewTask("");
    } catch (error) {
      console.error("Error removing task from IndexedDB:", error);
    }
  };

  const editTask = (index) => {
    setNewTask(tasks[index].task);
    setEditIndex(index);
  };

  return (
    <div className="App">
      <h1>To-Do</h1>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={addTask}>{editIndex !== null ? "Edit" : "Add"}</button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <div>{task.task}</div>
            <div className="icons">
              <FontAwesomeIcon
                icon={faPenToSquare}
                color="#774caf"
                onClick={() => editTask(index)}
              />
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => removeTask(index)}
                color="#d64444"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDo;

// import React, { useState, useEffect } from "react";
// import "./App.css";
// import { openDB } from "idb";

// function ToDo() {
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState("");

//   useEffect(() => {
//     fetchTasksFromIndexedDB();
//   }, []);

//   const fetchTasksFromIndexedDB = async () => {
//     try {
//       const db = await openDB("ToDoListDB", 1, {
//         upgrade(db) {
//           db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
//         },
//       });

//       const tx = db.transaction("tasks", "readonly");
//       const store = tx.objectStore("tasks");
//       const tasks = await store.getAll();
//       setTasks(tasks);
//     } catch (error) {
//       console.error("Error fetching tasks from IndexedDB:", error);
//     }
//   };

//   const addTask = async () => {
//     if (newTask.trim() !== "") {
//       try {
//         const db = await openDB("ToDoListDB", 1);
//         const tx = db.transaction("tasks", "readwrite");
//         const store = tx.objectStore("tasks");

//         // Add new task
//         await store.add({ task: newTask });

//         // Fetch updated tasks from IndexedDB
//         fetchTasksFromIndexedDB();

//         setNewTask("");
//       } catch (error) {
//         console.error("Error adding task to IndexedDB:", error);
//       }
//     }
//   };

//   const removeTask = async (index) => {
//     try {
//       const db = await openDB("ToDoListDB", 1);
//       const tx = db.transaction("tasks", "readwrite");
//       const store = tx.objectStore("tasks");

//       // Remove task from IndexedDB
//       await store.delete(tasks[index].id);

//       // Fetch updated tasks from IndexedDB
//       fetchTasksFromIndexedDB();

//       setNewTask("");
//     } catch (error) {
//       console.error("Error removing task from IndexedDB:", error);
//     }
//   };

//   const editTask = (index) => {
//     setNewTask(tasks[index].task);
//   };

//   return (
//     <div className="App">
//       <h1>To-Do</h1>
//       <div>
//         <input
//           type="text"
//           value={newTask}
//           onChange={(e) => setNewTask(e.target.value)}
//           placeholder="Enter a new task"
//         />
//         <button onClick={addTask}>Add</button>
//       </div>
//       <ul>
//         {tasks.map((task, index) => (
//           <li key={index}>
//             <div>{task.task}</div>
//             <div className="icons">
//               <button onClick={() => editTask(index)}>Edit</button>
//               <button onClick={() => removeTask(index)}>Delete</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ToDo;
