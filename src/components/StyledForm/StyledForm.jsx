import React from 'react';

const StyledForm = ({children , submitFunction: submitFunction}) => {
    return (
        <form className='flex flex-col justify-center gap-1 text-black bg-[#ca5f5f] p-6 rounded-xl' onSubmit={submitFunction} >
            {children}
        </form>
    );
};

export default StyledForm;