import { useState } from 'react';
import './loading.css';
export default function Loading({ success, loading }) {

    const [successicon, setsuccessicon] = useState(<div><div className='success'>&#x2713;</div></div>);

    return (
        <div className='loading-container'>
            {!success ?
                (<>
                    {loading && (
                        <div className='spinner'>
                            <span>Loading...</span>
                            <div className='spinner-icon'></div>
                        </div>
                    )}
                </>) : (
                    <>
                        {!loading &&
                            <>
                                {(setTimeout(() => {
                                    setsuccessicon(<></>);
                                    document.querySelector('.loading-container').style.display = 'none';
                                    clearTimeout();
                                }, 800)) &&
                                    <>{successicon}</>
                                }
                            </>
                        }
                    </>
                )
            }
        </div>
    );
}