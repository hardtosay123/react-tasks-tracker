import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "./Button";

const TaskDetails = () => {
    const [loading, setLoading] = useState(true);
    const [task, setTask] = useState({});
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchTask() {
            const res = await fetch(`http://localhost:5000/tasks/${params.id}`);
            const data = await res.json();

            if (res.status === 404) {
                navigate("/");
            }

            setTask(data);
            setLoading(false);
        }
        fetchTask();
    });
  return loading ? (
    <h3>Loading...</h3>
  ) : (
      <div>
          <h3>{ task.text }</h3>
          <p>{ task.day }</p>
          <p>Remind? {(task.reminder)?"Yes":"No"}</p>
          <Button onClick={() => {navigate(-1)}} text="Go Back" color="black" />
      </div>
  );
}

export default TaskDetails;