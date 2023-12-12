import axios, { CancelTokenSource } from "axios";
import MaskedInput from "react-text-mask";
import { useState, useRef } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Row,
} from "reactstrap";
import { ClientEmailType } from "../Types/ClietTypes";

export default function FormComponent(): JSX.Element {
  const [input, setInput] = useState({
    email: "",
    number: "",
  });
  const [userMail, setUserMail] = useState<ClientEmailType[]>([]);
  const [error, setError] = useState("");
  const [validateEmail, setValidateEmail] = useState(false);
  const [emailError, setEmailError] = useState("Not valid email");

  const abortControllerRef = useRef<CancelTokenSource | null>(null);

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ): void => {
    setInput((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    const validRe =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!validRe.test(String(event.target.value).toLocaleLowerCase())) {
      setEmailError("Email format qwerty@qwe.qwe");
    } else {
      setEmailError("");
    }
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    if (abortControllerRef.current) {
      abortControllerRef.current.cancel("Request aborted");
    }
    const newAbortController = axios.CancelToken.source();
    abortControllerRef.current = newAbortController;

    try {
      const res = await axios.post("http://localhost:3000/", input, {
        cancelToken: newAbortController.token,
      });

      if (res.status === 200) {
        setUserMail([]);
        setUserMail(() => [...res.data]);
        setInput({
          email: "",
          number: "",
        });
        setError("");
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Canceled", err.message);
      }
      if (axios.isAxiosError(err) && err.response) {
        const { response } = err;
        if (response.status === 401) {
          setUserMail([]);
          setError("No such email");
        } else if (response.status === 402) {
          setUserMail([]);
          setUserMail((prev) => [...prev, ...response.data]);
          setError("No such number");
        }
        console.error(error);
      }
    }
  };

  const validateHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    switch (event.target.name) {
      case "email":
        setValidateEmail(true);
        break;
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <Row>
        <Col>
          <Form onSubmit={submitHandler}>
            <FormGroup>
              <Input
                id="exampleEmail"
                name="email"
                placeholder="eMail:"
                type="email"
                value={input.email}
                onChange={changeHandler}
                onBlur={(event) => validateHandler(event)}
              />
              {validateEmail && emailError && (
                <span className="text-danger">{emailError}</span>
              )}
            </FormGroup>
            <FormGroup>
              <MaskedInput
                mask={[/\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/]}
                name="number"
                placeholder="Number:"
                value={input.number}
                onChange={changeHandler}
                className="form-control"
              />
            </FormGroup>

            <Button color="primary" style={{ width: "100vh" }} type="submit">
              Submit
            </Button>
            {userMail.map((el) => (
              <p key={el.number}>
                {el.email} {el.number}{" "}
              </p>
            ))}
          </Form>
          {error && <span className="text-danger">{error}</span>}
        </Col>
      </Row>
    </Container>
  );
}
