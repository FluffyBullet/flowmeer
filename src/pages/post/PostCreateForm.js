import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import Upload from "../../assets/upload.gif";
import appStyles from "../../styles/PostCreateEdit.module.css";
import styles from "../../styles/PostCreateEdit.module.css";
import pageAccessories from "../../styles/pageAccessories.module.css";
import Asset from "../../components/Asset";
import { Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

function PostCreateForm() {
    const [errors, setErrors] = useState({});

    const [postData, setPostData] = useState({
        title: "",
        flower_tag: "",
        image: "",
    });
    const { title, flower_tag, image } = postData;

    const imageInput = useRef(null)
    const navigate = useNavigate();

    const handleChange = (event) => {
        setPostData({
            ...postData,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setPostData({
                ...postData,
                image: URL.createObjectURL(event.target.files[0]),
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData()

        formData.append('title', title);
        formData.append('flower_tag', flower_tag);
        formData.append('image', imageInput.current.files[0]);

        try {
            const { data } = await axiosReq.post('/post/', formData);
            navigate('post/')
        } catch (err) {
            console.log(err)
            if (err.response?.status !== 401) {
                setErrors(err.response?.data)
            }
        }
    }

            const textFields = (
                <div className="text-center">
                    {/* Request users to create a title for their post */}
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={title}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        {/* Intended as flower tag, but amended to description for temporary. */}
                        <Form.Label>Your Comment:</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="flower_tag"
                            value={flower_tag}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Button className={pageAccessories.first_button} type="submit">
                        create
                    </Button>
                    <Button
                        className={pageAccessories.first_button}
                        onClick={() => { }}
                    >
                        cancel
                    </Button>
                </div>
            );

            return (
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col >
                            <Container
                                className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
                            >
                                <Form.Group className="text-center">
                                    {image ? (
                                        <>
                                            <figure>
                                                <Image className={appStyles.Image} src={image} rounded />
                                            </figure>
                                            <div>
                                                <Form.Label
                                                    className={pageAccessories.first_button}
                                                    htmlFor="image-upload"
                                                >
                                                    Change the image
                                                </Form.Label>
                                            </div>
                                        </>
                                    ) : (
                                        <Form.Label
                                            className="d-flex justify-content-center "
                                            htmlFor="image-upload"
                                        >
                                            <Asset
                                                src={Upload}
                                                message="Click or tap to upload an image"
                                            />
                                        </Form.Label>
                                    )}

                                    <Form.File
                                        className={"d-none"}
                                        id="image-upload"
                                        accept="image/*"
                                        onChange={handleChangeImage}
                                        ref={imageInput}
                                    />
                                </Form.Group>
                                <div className="d-md-none">{textFields}</div>
                            </Container>
                        </Col>
                        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
                            <Container className={appStyles.Content}>{textFields}</Container>
                        </Col>
                    </Row>
                </Form>
            );
        }
        export default PostCreateForm;