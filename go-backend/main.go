package main

import (
  "net/http"
  "github.com/gin-gonic/gin"
  "context"
  "github.com/redis/go-redis/v9"
  "fmt"
)

type Message struct {
  Id string `json:"id"`
  Message string `json:"message"`
  Name string `json:"name"`
}

func connectRedis (ctx context.Context) *redis.Client {
  rdb := redis.NewClient(&redis.Options{
    Addr:         "localhost:6379",
    Password: "", // no password set
    DB:           0,  // use default DB
  })

  err := rdb.Set(ctx, "key", "value", 0).Err()
  if err != nil {
    panic(err)
  }

  val, err := rdb.Get(ctx, "key").Result()
  if err != nil {
    panic(err)
  }
  fmt.Println("key", val)

  val2, err := rdb.Get(ctx, "key2").Result()
  if err == redis.Nil {
    fmt.Println("key2 does not exist")
  } else if err != nil {
    panic(err)
  } else {
    fmt.Println("key2", val2)
  }
  return rdb
}

// unprotected rest api
func restApi (r *gin.RouterGroup, rdb *redis.Client, ctx context.Context) {
  r.GET(":id", func(c *gin.Context) {
    id := c.Param("id")
    val, err := rdb.Get(ctx, id).Result()
    switch {
    case err == redis.Nil:
      c.JSON(http.StatusNotFound, gin.H{
        "message": "GET " + id + " request received, but does not exist",
      })
    case err != nil:
      c.JSON(http.StatusNotFound, gin.H{
        "message": "GET " + id + " request received, but failed to retrieve from database",
      })
    case val == "":
      c.JSON(http.StatusNotFound, gin.H{
        "message": "GET " + id + " request received, but the key value is empty",
      })
    default:
      c.JSON(http.StatusOK, gin.H{
        "message": "GET request " + id + " received",
        "value": val,
      })
    }
  })

  r.GET("/", func(c *gin.Context) {
    val, err := rdb.Get(ctx, "key").Result()
    if err == redis.Nil {
      c.JSON(http.StatusOK, gin.H{
        "message": "key does not exist",
      })
    } else if err != nil {
      c.JSON(http.StatusNotFound, gin.H{
        "message": err.Error(),
      })
    } else {
      c.JSON(http.StatusOK, gin.H{
        "message": "key",
        "value": val,
      })
    }
  })
}

// protected rest api
// generate CRUD for messages while checking auth cookie
func protectedRestApi (r *gin.RouterGroup, rdb *redis.Client, ctx context.Context) {
  // message api routes POST, PUT, DELETE, PATCH
  r.POST("/", func(c *gin.Context) {
    // parse body { "id": "1", "message": "hello world", "name": "bob" }
    if (c.ContentType() == "application/json") {
      var msg *Message = &Message{}
      err := c.BindJSON(msg); if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
          "message": err.Error(),
        })
        return
      }
      rdb.HSet(ctx, msg.Id, "message", msg.Message); /*if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
          "message": "POST request received, but failed to save to database",
        })
        return
      }*/
      rdb.HSet(ctx, msg.Id, "name", msg.Name) /* if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
          "message": "POST request received, but failed to save to database",
        })
        return
      }
      */
      c.JSON(http.StatusCreated, gin.H{
        "message": "POST request received",
      })
      return
      // TODO body parse and value change
    } else if (c.ContentType() == "application/x-protobuf" || c.ContentType() == "application/octet-stream") {
      // TODO parse protobuf
      c.JSON(http.StatusNoContent, gin.H{
        "message": "POST request with protobufs received, but not implemented",
      })
    }
  })
  // TODO PATCH
  r.PUT(":id", func(c *gin.Context) {

    // redis
    err := rdb.Set(ctx, "key", "value", 0).Err()
    if err != nil {
      panic(err)
    }
    // Handle the POST request
    c.JSON(http.StatusCreated, gin.H{
      "message": "PATCH request received",
    })
  })
  r.DELETE(":id", func(c *gin.Context) {
    // Handle the DELETE request
    c.JSON(http.StatusFound, gin.H{
      "message": "DELETE request received: NOT implemented",
    })
  })
}

// unprotected protobuf api

// protected protobuf api

// TODO add authenticated route (using headers and JWT)
// TODO add authenticated route (using cookies)
// TODO make both json and protobuf versions
// TODO use in-memory database (redis)

func AuthRequired () gin.HandlerFunc {
  return func(c *gin.Context) {
    session, err := c.Cookie("Session")
    if err != nil {
      c.JSON(http.StatusUnauthorized, gin.H{
        "message": "no session cookie",
      })
      c.Abort()
      return
    }
    if session == "Id" {
      c.Next()
      return
    }
    c.JSON(http.StatusUnauthorized, gin.H{
      "message": "unauthorized",
    })
    c.Abort()
  }
}

func main() {
  ctx := context.Background()
  rdb := connectRedis(ctx)
  r := gin.Default()

  r.GET("/api/coffee", func(c *gin.Context) {
    c.JSON(http.StatusTeapot, gin.H{
    })
  })

  json := r.Group("/api/json/messages")
  restApi(json, rdb, ctx)
  rest := r.Group("/api/messages")
  restApi(rest, rdb, ctx)

  // TODO enable auth
  protected := r.Group("/api/messages")
  // protected.Use(AuthRequired())
  protectedRestApi(protected, rdb, ctx)
  pjson := r.Group("/api/json/messages")
  // pjson.Use(AuthRequired())
  protectedRestApi(pjson, rdb, ctx)

  // Start the Gin server on port 8080
  r.Run(":8080")
}
