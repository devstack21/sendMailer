import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

async function deleteFileRecursively(filePath, attempt = 0, maxAttempts = 5){
    try {
        await unlinkAsync(filePath);
        console.log(`Le fichier ${filePath} supprimé avec succès.`);
    } catch (error) {
        console.error(`Erreur de suppression du fichier ${filePath} (retry ${attempt + 1}):`, error);

        if (attempt < maxAttempts) {
            setTimeout(async () => {
                await deleteFileRecursively(filePath, attempt + 1, maxAttempts);
            }, 5000);
            
        } else {
            throw new Error(`Echec de suppression du fichier ${filePath} après ${maxAttempts} retry: ${error}`);
        }
    }
}

export default deleteFileRecursively;
