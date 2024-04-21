import React from 'react';

const StyledForm = ({children , submitFunction: submitFunction}) => {
    return (
        <form className='flex flex-col justify-center gap-1 text-white bg-purple-800 p-6 rounded-xl' onSubmit={submitFunction} >
            {children}
        </form>
    );
};

export default StyledForm;