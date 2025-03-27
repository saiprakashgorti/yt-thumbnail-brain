export const saveResponses = async (responses) => {
    // Replace with actual API call
    console.log('Saving responses:', responses);
    localStorage.setItem('thumbnail-study-responses', JSON.stringify(responses));
};

// Add to StudyContext.jsx
const saveData = async () => {
    try {
        await saveResponses(responses);
    } catch (error) {
        console.error('Error saving responses:', error);
    }
};
