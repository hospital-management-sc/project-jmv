import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import styles from './Home.module.css'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof schema>

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
    alert('Form submitted successfully!')
    reset()
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Welcome to Hospital Management System</h1>
        <p>A modern, efficient solution for managing hospital operations</p>
      </div>

      <div className={styles.content}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Patient Management</h3>
            <p>Manage patient records, appointments, and medical history efficiently.</p>
          </div>
          <div className={styles.card}>
            <h3>Doctor Scheduling</h3>
            <p>Schedule appointments with healthcare professionals seamlessly.</p>
          </div>
          <div className={styles.card}>
            <h3>Medical Records</h3>
            <p>Secure and accessible medical records for all patients.</p>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                {...register('name')}
              />
              {errors.name && (
                <span className={styles.error}>{errors.name.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register('email')}
              />
              {errors.email && (
                <span className={styles.error}>{errors.email.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                placeholder="Your message..."
                rows={5}
                {...register('message')}
              />
              {errors.message && (
                <span className={styles.error}>{errors.message.message}</span>
              )}
            </div>

            <button type="submit" className={styles.button}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
