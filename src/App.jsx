import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

// const baseUrl = "http://localhost/00_GS/01_assignment/08_book/react_todo/";
const baseUrl ='https://kkgsacademy.sakura.ne.jp/gs08_book/'

function App() {
    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);
    // const [count, setCount] = useState(0);

    const formData = new FormData();
    formData.append("todo", todo);

    const params = new URLSearchParams();
    params.append("todo", todo);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const todos = await fetch(baseUrl + "getTodos.php");
        const string = await todos.text();
        const json = string === "" ? {} : JSON.parse(string);
        setTodos(json.data);
    };

    const addTodo = async () => {
        axios.post(baseUrl + "addTodo.php", params).then(() => {
            fetchTodos();
        });
        // const todos = await fetch(baseUrl+'addTodo.php',{
        //     method:'POST',
        //     body:formData
        // })
        // const string = await todos.text();
        // const json = string === "" ? {} : JSON.parse(string);

        // if (json.success) {
        //         fetchTodos()
        // }
    };

    const deleteTodo = async (id) => {
        params.append("id", id);
        axios.post(baseUrl + "deleteTodo.php", params).then(() => {
            fetchTodos();
        });

        // formData.append("id", id);
        // const resp = await fetch(baseUrl + "deleteTodo.php", {
        //     method: "POST",
        //     body: formData,
        // });

        // const string = await resp.text();
        // const json = string === "" ? {} : JSON.parse(string);

        // if (json.success) {
        //     fetchTodos();
        // }
        // setCount(count + 1);
    };

    const editTodo = async (id, todo) => {
        params.append("id", id);
        params.append("todo", todo);
        axios.post(baseUrl + "editTodo.php", params).then(() => {
            fetchTodos();
        });

        // formData.append("id", id);
        // formData.append("todo", todo);

        // const resp = await fetch(baseUrl + "editTodo.php", {
        //     method: "POST",
        //     body: formData,
        // });

        // const string = await resp.text();
        // const json = string === "" ? {} : JSON.parse(string);
        // if (json.success) {
        //     fetchTodos();
        // }
        // setCount(count + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        addTodo();
        setTodo("");
    };

    return (
        <div className="ml-3 mt-3">
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        value={todo}
                        onChange={(e) => {
                            setTodo(e.target.value);
                        }}
                        className="bg-gray-200"
                    />
                    <button
                        type="submit"
                        className="ml-2 bg-red-600 hover:bg-red-500 text-white rounded px-4 py-2"
                    >
                        Add
                    </button>
                </div>
            </form>
            <div>
                {todos.map((item, index) => {
                    return (
                        <Todo
                            key={item.id}
                            index={item.id}
                            item={item.todo}
                            deleteTodo={(id) => {
                                deleteTodo(id);
                            }}
                            editTodo={(todo) => {
                                editTodo(item.id, todo);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default App;

const Todo = ({ item, deleteTodo, index, editTodo }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [todo, setTodo] = useState(item);

    const handleSubmit = (e) => {
        e.preventDefault();
        editTodo(todo);
        setIsEdit(false);
    };

    return (
        <div className="mt-3" key={index}>
            <div>
                <div className="flex items-center">
                    <p>{index}．</p>
                    {isEdit ? (
                        <form onSubmit={handleSubmit}>
                            <div className="flex">
                                <input
                                    className=""
                                    value={todo}
                                    onChange={(e) => {
                                        setTodo(e.target.value);
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-400 text-white rounded px-4 py-2"
                                >
                                    Edit
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="">{item}</p>
                    )}
                    <div>
                        <button
                            className="ml-2 bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2"
                            onClick={() => {
                                setIsEdit((prev) => !prev);
                            }}
                        >
                            {isEdit ? "Cancel" : "Edit"}
                        </button>
                        <button
                            className="bg-gray-900 hover:bg-gray-800 text-white rounded px-4 py-2"
                            onClick={() => {
                                deleteTodo(index);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
