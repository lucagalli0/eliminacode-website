import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(
  sleepTime: number,
  fn: (...args: any[]) => Promise<any>,
  retries: number,
  cb: (...args: any[]) => void
) {
  const json = await fn().then((response) => response.json());

  if (json.msg !== undefined) {
    if (retries > 0) {
      cb({ msg: `Retrying...\nRetries left: ${retries - 1}`, data: json });
      await sleep(sleepTime);
      await request(sleepTime, fn, --retries, cb);
    } else {
      cb({ msg: 'Fail: Out of retries' });
    }
  } else {
    cb({ msg: 'Success', data: json });
  }
}

const Home: NextPage = () => {
  const [result, setResult] = useState('');
  const [sleepTime, setSleepTime] = useState(1000);
  const [retries, setRetries] = useState(3);
  const [requestBody, setRequestBody] = useState(
    JSON.stringify({ GetCalendarStatus: { CalendarId: 108 } })
  );
  const [loading, setLoaing] = useState(false);

  const onClick = async () => {
    setLoaing(true);
    setResult('');
    await request(
      1000,
      () =>
        fetch('/api/test', {
          method: 'POST',
          body: requestBody
        }),
      retries,
      ({ data, msg }) => {
        setResult((d) => d + '\n' + msg + '\n' + JSON.stringify(data, null, 2));
      }
    );
    setLoaing(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Test API</title>
        <meta name="description" content="Test API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <label htmlFor="sleepTime">
            Sleep time:
            <input
              id="sleepTime"
              type="number"
              value={sleepTime}
              onChange={(e) => setSleepTime(Number(e.target.value))}
            />
          </label>
        </div>
        <div>
          <label htmlFor="retries">
            Retries:
            <input
              id="retries"
              type="number"
              value={retries}
              onChange={(e) => setRetries(Number(e.target.value))}
            />
          </label>
        </div>
        <div>
          <label htmlFor="request" className={styles.flex}>
            Request:
            <textarea
              id="request"
              value={requestBody}
              rows={8}
              onChange={(e) => setRequestBody(e.target.value)}
            />
          </label>
        </div>
        <button type="button" onClick={onClick} disabled={loading}>
          fetch
        </button>
        <pre className={styles.code}>{result}</pre>
      </main>
    </div>
  );
};

export default Home;
