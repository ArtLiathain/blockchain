import React from 'react';
import blockchain from '../assets/blockchain.png'

const Homepage = () => {
    return (
        <div className='flex justify-center'>
            <div className='grid mx-16 grid-cols-2 gap-4 mt-10 w-3/5 '>
                <img src={blockchain} className='w-full h-full object-cover' />
                <a href="/home" className='text-white w-full flex justify-center items-center text-center break-words text-2xl'>
                    Create your own wallet
                </a>
            </div>
        </div>
    );
};

export default Homepage;