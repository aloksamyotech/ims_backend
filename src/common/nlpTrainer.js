import { NlpManager } from 'node-nlp';
import path from 'path';

const manager = new NlpManager({ languages: ['en'] });
const trainNLP = async () => {
    manager.addDocument('en', 'list products', 'list.products');
    manager.addDocument('en', 'show me all products', 'list.products');
    manager.addDocument('en', 'display all items', 'list.products');
    manager.addDocument('en', 'find product by category electronics', 'find.product.category');
    manager.addDocument('en', 'search items in category electronics', 'find.product.category');
    await manager.train();
    await manager.save();
    console.log('NLP model trained and saved!');
};
trainNLP();
