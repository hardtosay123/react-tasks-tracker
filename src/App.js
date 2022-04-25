import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AddTask from "./components/AddTask";
import Tasks from "./components/Tasks";
import Footer from "./components/Footer";
import About from "./components/About";
import TaskDetails from "./components/TaskDetails";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  useEffect(function () {
    async function getTasks() {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    }
    getTasks();
  }, []);
  async function fetchTasks() {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();
    return data;
  }
  async function fetchTask(id) {
    const res = await fetch("http://localhost:5000/tasks/"+id);
    const data = await res.json();
    return data;
  }
  async function deleteTask(id) {
    await fetch("http://localhost:5000/tasks/"+id, {
      method: "DELETE"
    });
    setTasks(tasks.filter((task) => task.id !== id));
  }
  async function toggleReminder(id) {
    const taskToToggle = await fetchTask(id);
    const updateTask = { ...taskToToggle, reminder: !taskToToggle.reminder };
    const res = await fetch("http://localhost:5000/tasks/"+id, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(updateTask)
    });
    const data = await res.json();
    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder } : task ));
  }
  async function addTask(task) {
    // var id = Math.floor(Math.random() * 10000) + 1;
    // var newTask = { id, ...task };
    // setTasks([...tasks, newTask]);
    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(task)
    });
    const data = await res.json();
    setTasks([...tasks, data]);
  }
  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
        <Routes>
          <Route path="/" element={
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : "No Tasks To Show" }
            </>
          } />
          <Route path="/about" element={ <About /> } />
          <Route path="/tasks/:id" element={ <TaskDetails /> } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;