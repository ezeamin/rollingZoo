import React from "react";
import Plan from "./plan/Plan";
import "./panelPlanes.css";
import Swal from "sweetalert2";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

const PanelPlanes = (props) => {
  const navigate = useNavigate();
  const [checked, setChecked] = React.useState([false, false, false, false]);
  const [seleccionado, setSeleccionado] = React.useState("0");
  const [mascota, setMascota] = React.useState("0");
  const [mascotas, setMascotas] = React.useState([]);
  const [isInvalid, setIsInvalid] = React.useState(false);

  const planes = [
    {
      titulo: "Sin plan",
      descripcion: "Ningun beneficio adicional",
      checked: checked[0],
    },
    {
      titulo: "Primeros pasos",
      descripcion: "Mascotas de entre 0 y 5 años",
      checked: checked[1],
    },
    {
      titulo: "Madurando",
      descripcion: "Mascotas de entre 5 y 10 años",
      checked: checked[2],
    },
    {
      titulo: "Adultos",
      descripcion: "Mascotas de más de 10 años",
      checked: checked[3],
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (seleccionado === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes seleccionar un plan",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (mascota === "0") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes seleccionar una mascota",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    guardarPlan();
  };

  const guardarPlan = async () => {
    const mascotaSeleccionada = mascotas.find((m) => m.nombre === mascota);

    const response = await fetch(
      `/api/user/guardarPlan/${props.user.dni}/${mascotaSeleccionada.codigoMascota}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: seleccionado,
        }),
      }
    );
    const data = await response.json();

    if (data.ok) {
      Swal.fire({
        icon: "success",
        title: "Exito",
        text: "Plan guardado",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/user/perfil/mascotas");
      });
    }
  };

  React.useEffect(() => {
    const fetchInfo = async () => {
      const response = await fetch(
        `/api/user/pacientes/mascotas/${props.user.dni}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      setMascotas(data.mascotas);
    };
    fetchInfo();
  }, [props.user.dni]);

  React.useEffect(() => {
    const mascotaSeleccionada = mascotas.find((m) => m.nombre === mascota);

    if (mascotaSeleccionada) {
      switch (mascotaSeleccionada.plan) {
        case "Sin plan":
          setChecked([true, false, false, false]);
          break;
        case "Primeros pasos":
          setChecked([false, true, false, false]);
          break;
        case "Madurando":
          setChecked([false, false, true, false]);
          break;
        case "Adultos":
          setChecked([false, false, false, true]);
          break;
        default:
          break;
      }
    }
  }, [mascota,mascotas]);

  return (
    <div className="container py-5 admin__panel-content user__panel">
      <div className="user__panel-planes__titulo">
        <h1 className="mb-3 h3__bold">Planes</h1>
      </div>
      <Form className="text-start">
        <Form.Group className="mt-2">
          <Form.Select
            type="select"
            placeholder="Mascota"
            name="mascota"
            className="input"
            isInvalid={isInvalid}
            value={mascota}
            onChange={(e) => setMascota(e.target.value)}
            onBlur={(e) => {
              if (e.target.value === "0") {
                setIsInvalid(true);
              } else {
                setIsInvalid(false);
              }
            }}
          >
            <option value="0">Seleccione mascota</option>
            {mascotas.map((mascota, index) => {
              return (
                <option key={index} value={mascota.nombre}>
                  {mascota.nombre}
                </option>
              );
            })}
          </Form.Select>
          <Form.Control.Feedback className="feedback" type="invalid">
            Seleccione una mascota
          </Form.Control.Feedback>
        </Form.Group>
      </Form>
      <form className="user__panel__planes-content row" onSubmit={handleSubmit}>
        {planes.map((plan, index) => {
          return (
            <div className="col-sm-12 col-md-6">
              <Plan
                key={index}
                plan={plan}
                index={index}
                setSeleccionado={setSeleccionado}
              />
            </div>
          );
        })}
        <button className="btnForm">Guardar</button>
      </form>
    </div>
  );
};

export default PanelPlanes;