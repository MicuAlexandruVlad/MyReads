export default class Book {
    id = '';
    name = '';
    author = '';
    read = false;
    reading = false;
    wantToRead = false;
    startedAt = '';
    finishedAt = '';
    url = '';

    // 1 -> Currently Reading, 2 -> Want to Read, 3 -> Read
    category = 0

    // 1-5
    rating = 0;
}