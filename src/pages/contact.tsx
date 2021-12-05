import { PageProps, navigate } from "gatsby"
import React, {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react"
import styled from "styled-components"
import { SooBtn } from "."
import Layout from "../components/layout"
import Container from "../components/MainWrapper"
import { SOOHint } from "../components/Navigation"
import Seo from "../components/seo"
import { PageTitle } from "./about"
import { RouteComponentProps } from "@reach/router"

export interface ContactProps {}
type LocationStateProp = { subject: string }
export type FormValueProp = {
  email: string
  name: string
  subject?: string
  message: string
  company: string
}

const Contact: React.FC<PageProps<ContactProps>> = ({ location }) => {
  const initialFormValue = {
    email: "",
    name: "",
    subject: "",
    message: "",
    company: "",
  }
  // console.log("params=" )
  useEffect(() => {
    const newURL = new URLSearchParams(location.search)
    setFormvalue({
      ...formValue,
      subject: newURL.get("subject") === null ? "" : `${newURL.get("subject")}`,
    })
    return () => {
      setFormvalue(initialFormValue)
    }
  }, [])
  const [formValue, setFormvalue] = useState<FormValueProp>(initialFormValue)
  const handleChange: ChangeEventHandler = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputName = e.target.name
    const inputValue = e.target.value
    setFormvalue({ ...formValue, [inputName]: inputValue })
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    e: FormEvent
  ) => {
    e.preventDefault()
    // TODO the code below works but I still need to sort the type out
    // e.target[0].focus()
    try {
      const apiResponse = await fetch("/api/soo-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formValue }),
      }).then(res => res.json())
      if (
        Object.keys(apiResponse).length === 0 &&
        apiResponse.constructor === Object
      ) {
        setFormvalue(initialFormValue)
        navigate("/thank-you/", { replace: true, state: { ...formValue } })
        return
      }
      // console.log(apiResponse)
      throw new Error(`${apiResponse.message}`)
    } catch (err) {
      console.log(
        "an error occured, please make sure all field have been field appropriately",
        `${err}`
      )
    }
  }

  return (
    <Layout location={location}>
      <Container>
        <Seo title="Contact" lang="en" />

        <PageTitle>Contact Me</PageTitle>
        <div>
          <section className="contact" id="contact">
            <div className="contact-content">
              <div className="form-findme">
                <div className="contact-form">
                  <ContactForm onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="name">Name</label>
                      <input
                        onChange={handleChange}
                        value={formValue.name}
                        type="text"
                        id="name"
                        name="name"
                        autoComplete="name"
                        placeholder="Name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email">E-mail</label>
                      <input
                        onChange={handleChange}
                        value={formValue.email}
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="Email"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="subject">Subject</label>
                      <input
                        onChange={handleChange}
                        value={formValue.subject}
                        type="text"
                        name="subject"
                        id="subject"
                        required
                        placeholder="Subject"
                      />
                    </div>

                    <div>
                      <label htmlFor="company">Company</label>
                      <input
                        onChange={handleChange}
                        value={formValue.company}
                        type="text"
                        id="company"
                        name="company"
                        placeholder="Company (optional)"
                      />
                    </div>
                    <div>
                      <label htmlFor="message">Message</label>
                      <textarea
                        onChange={handleChange}
                        value={formValue.message}
                        name="message"
                        required
                        placeholder="Message..."
                        cols={30}
                        rows={7}
                      ></textarea>
                    </div>
                    <div>
                      <SOOHint style={{ marginBottom: "1rem" }}>
                        Red outline means invalid field, make sure all field are
                        valid.
                      </SOOHint>
                      <SooBtn type="submit">Send</SooBtn>
                    </div>
                    {/* <!-- <input type="submit" value=""> --> */}
                  </ContactForm>
                </div>
                <div className="contact-findme">
                  <p>Find me on:</p>
                  <div className="socials">
                    <a
                      href="https://www.linkedin.com/in/solomon-obinna-ozoemenam-6a3440155/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src="./Images/LinkedIn.png" alt="" />
                    </a>
                    <a
                      href="https://www.xing.com/profile/SolomonObinna_Ozoemenam/cv"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src="./Images/Xing.png" alt="" />
                    </a>
                    <a
                      href="https://github.com/Ozoemenamsolomon"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src="./Images/github.png" alt="" />
                    </a>
                    <a
                      href="https://www.youtube.com/channel/UCpoLzjknNT6PNbJ9yX4RUng"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src="./Images/YouTube.png" alt="" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="contact-img">
                <img src="./Images/ContactMe_Char.png" alt="" />
              </div>
            </div>
          </section>
        </div>
      </Container>
    </Layout>
  )
}

export default Contact

const ContactForm = styled.form`
  display: grid;
  gap: 0.51rem;
  @media (min-width: 600px) {
    & {
      grid-template-columns: 1fr 1fr;
    }
    & > *:nth-last-child(2) {
      grid-column: span 2;
    }
  }
  & button {
    margin-top: 0;
  }

  & textarea:invalid,
  & input:invalid {
    border-color: red;
  }

  & textarea,
  & input {
    padding: 0.5rem;
    border-radius: 0.5rem;
    width: 100%;
    resize: vertical;

    border: 2px solid var(--light-blue);
    box-shadow: 2px 3px 5px #00000033;
  }
`
