import React, { useEffect } from 'react';

const GistEmbed = ({ gistUrl }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = gistUrl;
        script.async = true;

        // Create a container for the Gist
        const gistContainer = document.getElementById('gist-container');
        gistContainer.innerHTML = ''; // Clear any previous Gist
        gistContainer.appendChild(script);

        return () => {
            gistContainer.innerHTML = ''; // Cleanup on unmount
        };
    }, [gistUrl]);

    return <div id="gist-container"></div>;
};

export default GistEmbed;
