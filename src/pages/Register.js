import { NavLink as Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import uploadImage from '../images/upload-image.png';
import Loading from '../components/preloader/Loading';
import ImageResize from "../components/ImageResize";

export default function Register() {

    const navigate = useNavigate();
    const currentUser = useContext(AuthContext);
    const [{ success, loading }, setLoading] = useState({ success: false, loading: false });
    const [originalImg, setOriginalImg] = useState(null);
    const [croppedImg, setCroppedImg] = useState(null);

    useEffect(() => {
        if (currentUser !== null) {
            navigate('/');
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errorMsg = e.target.querySelector('.error-msg');
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const confirmPassword = e.target[3].value;
        const displayImage = e.target[4].files[0];
        setOriginalImg(displayImage);

        if (password === confirmPassword && displayImage) {
            try {
                //display loading animation on form submit
                setLoading({ success: false, loading: true });
                //Create user with email & password
                const res = await createUserWithEmailAndPassword(auth, email, password);
                //upload display image to firebase storage
                const storageRef = ref(storage, `/displayimages/${res.user.uid}.jpg`);
                const uploadTask = uploadBytesResumable(storageRef, croppedImg);
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        //monitor upload progress here
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

                        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // console.log('Upload is ' + progress + '% done');
                        // switch (snapshot.state) {
                        //     case 'paused':
                        //         console.log('Upload is paused');
                        //         break;
                        //     case 'running':
                        //         console.log('Upload is running');
                        //         break;
                        //     default:
                        //         break;
                        // }

                    },
                    (error) => {
                        console.error(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then(async (downloadURL) => {
                                await updateProfile(res.user, {
                                    displayName,
                                    photoURL: downloadURL
                                });

                                //update the users collection with document containing created user's public details
                                await setDoc(doc(db, "users", res.user.uid), {
                                    uid: res.user.uid,
                                    displayName,
                                    email,
                                    photoURL: downloadURL
                                });

                                //send email verificationlink
                                await sendEmailVerification(res.user);

                                //create userchats collection which contains all the chat info for this user(not the actual messages)
                                await setDoc(doc(db, "userChats", res.user.uid), {});

                                // SignUp successful hence stop loading animation 
                                setLoading({ success: false, loading: false });

                                //signout the user so as to prompt login for the first time
                                // signOut(auth);
                                alert('Account created successfully!!');
                            });
                    }
                );

            } catch (error) {
                console.error(error.message);
            }
            return;
        }

        //if passwords don't match do not submit
        e.target[2].value = '';
        e.target[3].value = '';
        errorMsg.innerHTML = "Passwords do not match"
        if (!displayImage) errorMsg.innerHTML = "Please select a display image";
        errorMsg.style.visibility = 'visible';
    };

    return (
        currentUser !== undefined &&
        <>
            {loading && <Loading success={success} loading={loading} />}
            <div className="register fade-in">
                {originalImg && <ImageResize image={originalImg} setCroppedImg={setCroppedImg} />}
                <h1>Sign up</h1>
                <form onSubmit={handleSubmit} >
                    <label className="error-msg"> Passwords do not match</label>
                    <input type="text" id="signup-username" placeholder='Display name' required />
                    <input type="email" id="signup-email" placeholder="Email" required />
                    <input type="password" id="signup-password" placeholder="Password" required />
                    <input type="password" id="confirm-password" placeholder="Confirm password" required />
                    <input type="file" id="upload-image" accept="image/jpeg" onChange={(e) => {
                        setOriginalImg(e.target.files[0]);
                        document.querySelector('.register #selected-file').innerHTML = e.target.value.replace("C:\\fakepath\\", "");
                    }} />
                    <label htmlFor="upload-image">
                        <img src={uploadImage} alt="" />
                        <span id='selected-file'>Upload image</span>
                    </label>
                    <button type="submit">Sign-up</button>
                </form>
                <div>Already have an account?
                    <span>
                        <Link to='/login'> Sign in</Link>
                    </span>
                </div>
            </div>
        </>
    )
}